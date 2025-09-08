# Backend Debugging Guide

## Overview

The backend includes comprehensive debugging utilities to help troubleshoot issues during development and production.

## Environment Variables

Add these to your `.env` file to control debugging:

```bash
# Debug settings
DEBUG=true                    # Enable/disable debug logging
DEBUG_LEVEL=basic            # Options: basic, verbose, off
```

## Debug Levels

- **`off`**: No debug output (production)
- **`basic`**: Essential debug info (requests, errors, key operations)
- **`verbose`**: Detailed debug info (full AST, detailed responses)

## Key Debug Outputs

### 1. API Requests
```
[DEBUG] === API REQUEST ===
[DEBUG] Request body keys: ['ast', 'images', 'options']
[DEBUG] Options: { templateName: "...", createCampaign: false }
[DEBUG] Images count: 1
```

### 2. Asset Processing
```
[DEBUG] === ASSET PROCESSING ===
[DEBUG] S3_BUCKET: undefined
[DEBUG] AWS_REGION: us-east-1
[DEBUG] Images to process: ['109:8']
[DEBUG] S3 not configured, using data URIs directly
```

### 3. Mailchimp Operations
```
[DEBUG] === MAILCHIMP TEMPLATE CREATE ===
[DEBUG] Template name: Figma Template
[DEBUG] List templates URL: https://us13.api.mailchimp.com/3.0/templates
[DEBUG] Template created successfully: 10006952
```

## Common Issues & Solutions

### "Region is missing" Error
- **Cause**: Missing AWS S3 configuration
- **Solution**: Either configure S3 or use data URI fallback (automatic)

### Mailchimp API Errors
- **Check**: `MC_ACCESS_TOKEN` and `MC_DC` in .env
- **Verify**: Token format (no quotes, no data center suffix)
- **Debug**: Look for "MAILCHIMP" debug logs

### Image Upload Issues
- **S3 Configured**: Check AWS credentials and bucket permissions
- **S3 Not Configured**: Uses data URIs (base64 embedded images)

## Development vs Production

### Development (.env)
```bash
DEBUG=true
DEBUG_LEVEL=verbose
MC_ACCESS_TOKEN=your_token_here
MC_DC=us13
```

### Production
```bash
DEBUG=false
# or remove DEBUG entirely
```

## File Structure

- `src/utils/debug.ts` - Debug utility functions
- `src/routes/compile.ts` - API endpoint debugging
- `src/services/mailchimp.ts` - Mailchimp API debugging  
- `src/services/assets.ts` - Asset upload debugging
