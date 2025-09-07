import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EmailAst } from "@figmc/shared";

const s3 = new S3Client({});

function parseDataUri(dataUri: string) {
  // data:image/png;base64,AAAA...
  const idx = dataUri.indexOf(";base64,");
  if (idx === -1) throw new Error("Unsupported image encoding");
  const meta = dataUri.slice(5, idx); // image/png
  const base64 = dataUri.slice(idx + 8);
  const contentType = meta;
  const bytes = Buffer.from(base64, "base64");
  return { bytes, contentType };
}

/**
 * Upload images to S3 and rewrite each ImageBlock to include `src` URL.
 */
export async function uploadAssetsAndRewrite(ast: EmailAst, images: Record<string,string>) {
  const bucket = process.env.S3_BUCKET!;
  const prefix = (process.env.S3_PREFIX || "emails").replace(/\/$/, "");
  const region = process.env.AWS_REGION || "us-east-1";

  const clone: EmailAst = JSON.parse(JSON.stringify(ast));
  const uploads: Promise<any>[] = [];

  for (const s of clone.sections) {
    for (const c of s.columns) {
      for (const b of c.blocks) {
        if (b.type === "image") {
          const bin = images[b.key];
          if (!bin) throw new Error(`Missing image binary for key ${b.key}`);
          const { bytes, contentType } = parseDataUri(bin);
          const key = `${prefix}/${b.key}.png`;
          uploads.push(s3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: bytes,
            ContentType: contentType || "image/png",
            ACL: "public-read"
          })));
          (b as any).src = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
        }
      }
    }
  }
  await Promise.all(uploads);
  return clone;
}
