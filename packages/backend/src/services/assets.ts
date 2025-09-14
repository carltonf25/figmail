import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { EmailAst } from "@figmc/shared";
import { createHash } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  maxAttempts: 3,
  retryMode: "adaptive"
});

interface ImageMetadata {
  bytes: Buffer;
  contentType: string;
  extension: string;
  width?: number;
  height?: number;
}

function parseDataUri(dataUri: string): ImageMetadata {
  // data:image/png;base64,AAAA...
  const idx = dataUri.indexOf(";base64,");
  if (idx === -1) throw new Error("Unsupported image encoding. Expected base64 data URI.");

  const meta = dataUri.slice(5, idx); // image/png
  const base64 = dataUri.slice(idx + 8);
  const contentType = meta;
  const bytes = Buffer.from(base64, "base64");

  // Validate file size
  const maxSizeMB = parseInt(process.env.MAX_IMAGE_SIZE_MB || "10");
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (bytes.length > maxSizeBytes) {
    throw new Error(`Image too large. Maximum size is ${maxSizeMB}MB, got ${(bytes.length / 1024 / 1024).toFixed(2)}MB`);
  }

  // Determine file extension
  let extension = "png"; // default
  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    extension = "jpg";
  } else if (contentType.includes("gif")) {
    extension = "gif";
  } else if (contentType.includes("webp")) {
    extension = "webp";
  }

  return { bytes, contentType, extension };
}

function generateUniqueFilename(originalKey: string, extension: string): string {
  const timestamp = Date.now();
  const hash = createHash("md5").update(`${originalKey}-${timestamp}`).digest("hex").substring(0, 8);
  const safeKey = originalKey.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${safeKey}_${timestamp}_${hash}.${extension}`;
}

async function uploadWithRetry(bucket: string, key: string, body: Buffer, contentType: string, maxRetries = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000", // 1 year cache
        Metadata: {
          uploadedAt: new Date().toISOString(),
          originalSize: body.length.toString(),
          source: "figmail-plugin"
        }
      }));
      console.log(`✅ Successfully uploaded ${key} (attempt ${attempt})`);
      return;
    } catch (error: any) {
      console.warn(`⚠️ Upload attempt ${attempt}/${maxRetries} failed for ${key}:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(`Failed to upload ${key} after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff: wait 1s, 2s, 4s...
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function testS3Connection(): Promise<{ success: boolean; message: string }> {
  const bucket = process.env.S3_BUCKET;

  if (!bucket) {
    return { success: false, message: "S3_BUCKET not configured" };
  }

  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    return { success: true, message: `Successfully connected to S3 bucket: ${bucket}` };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to connect to S3 bucket ${bucket}: ${error.message}`
    };
  }
}

/**
 * Upload images to S3 and rewrite each ImageBlock to include `src` URL.
 * Enhanced with retry logic, unique filenames, and better error handling.
 */
export async function uploadAssetsAndRewrite(
  ast: EmailAst,
  images: Record<string, string>
): Promise<EmailAst> {
  const bucket = process.env.S3_BUCKET;
  const prefix = (process.env.S3_PREFIX || "emails").replace(/\/$/, "");
  const region = process.env.AWS_REGION || "us-east-1";
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;

  console.log("=== ENHANCED ASSET UPLOAD ===");
  console.log("S3_BUCKET:", bucket);
  console.log("AWS_REGION:", region);
  console.log("CloudFront:", cloudfrontDomain || "Not configured");
  console.log("Images to process:", Object.keys(images).length);

  const clone: EmailAst = JSON.parse(JSON.stringify(ast));

  // If S3 is not configured, fallback to data URIs
  if (!bucket) {
    console.log("⚠️ S3 not configured, using data URIs directly (not recommended for production)");
    for (const s of clone.sections) {
      for (const c of s.columns) {
        for (const b of c.blocks) {
          if (b.type === "image") {
            const bin = images[b.key];
            if (bin) {
              (b as any).src = bin; // Use data URI directly
            } else {
              console.warn(`⚠️ Missing image data for key: ${b.key}`);
            }
          }
        }
      }
    }
    return clone;
  }

  // Test S3 connection before proceeding
  const connectionTest = await testS3Connection();
  if (!connectionTest.success) {
    throw new Error(`S3 Connection Failed: ${connectionTest.message}`);
  }

  const uploads: Array<{ promise: Promise<void>; block: any; key: string; url: string }> = [];
  let totalSizeBytes = 0;

  // Prepare all uploads
  for (const s of clone.sections) {
    for (const c of s.columns) {
      for (const b of c.blocks) {
        if (b.type === "image") {
          const bin = images[b.key];
          if (!bin) {
            throw new Error(`Missing image binary for key: ${b.key}`);
          }

          try {
            const { bytes, contentType, extension } = parseDataUri(bin);
            const filename = generateUniqueFilename(b.key, extension);
            const s3Key = `${prefix}/${filename}`;

            totalSizeBytes += bytes.length;

            // Generate URL (CloudFront if available, otherwise direct S3)
            const baseUrl = cloudfrontDomain
              ? `https://${cloudfrontDomain}`
              : `https://${bucket}.s3.${region}.amazonaws.com`;
            const imageUrl = `${baseUrl}/${s3Key}`;

            uploads.push({
              promise: uploadWithRetry(bucket, s3Key, bytes, contentType),
              block: b,
              key: s3Key,
              url: imageUrl
            });

            // Set the URL immediately (optimistic)
            (b as any).src = imageUrl;

          } catch (error: any) {
            throw new Error(`Failed to process image ${b.key}: ${error.message}`);
          }
        }
      }
    }
  }

  console.log(`📦 Uploading ${uploads.length} images (${(totalSizeBytes / 1024 / 1024).toFixed(2)}MB total)`);

  // Execute all uploads with progress tracking
  const results = await Promise.allSettled(uploads.map(u => u.promise));

  // Check for failures
  const failures = results.reduce((acc: string[], result, index) => {
    if (result.status === 'rejected') {
      const upload = uploads[index];
      acc.push(`${upload.key}: ${result.reason}`);
      // Fallback to data URI for failed uploads
      (upload.block as any).src = images[upload.block.key];
    }
    return acc;
  }, []);

  if (failures.length > 0) {
    console.warn(`⚠️ ${failures.length} image upload(s) failed, using data URIs as fallback:`);
    failures.forEach(f => console.warn(`  - ${f}`));
  }

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  console.log(`✅ Successfully uploaded ${successCount}/${uploads.length} images`);

  return clone;
}
