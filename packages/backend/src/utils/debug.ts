/**
 * Debug utility for controlled logging
 */

const DEBUG_ENABLED = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 'basic'; // basic, verbose, off

export function debugLog(message: string, data?: any, level: 'basic' | 'verbose' = 'basic') {
  if (!DEBUG_ENABLED || DEBUG_LEVEL === 'off') return;
  if (level === 'verbose' && DEBUG_LEVEL !== 'verbose') return;
  
  console.log(`[DEBUG] ${message}`);
  if (data !== undefined) {
    console.log(typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  }
}

export function debugRequest(req: any) {
  debugLog("=== API REQUEST ===");
  debugLog("Request body keys:", Object.keys(req.body));
  debugLog("Options:", req.body.options, 'basic');
  debugLog("AST:", req.body.ast, 'verbose');
  debugLog("Images count:", Object.keys(req.body.images || {}).length);
}

export function debugMailchimp(operation: string, data?: any) {
  debugLog(`=== MAILCHIMP ${operation.toUpperCase()} ===`);
  if (data) debugLog("Data:", data);
}

export function debugAssets(s3Config: any, images: any) {
  debugLog("=== ASSET PROCESSING ===");
  debugLog("S3_BUCKET:", s3Config.bucket);
  debugLog("AWS_REGION:", s3Config.region);
  debugLog("Images to process:", Object.keys(images));
}
