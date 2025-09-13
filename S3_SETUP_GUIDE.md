# AWS S3 Setup Guide for FigMail

This guide will walk you through setting up AWS S3 for image hosting in FigMail.

## 🚀 Quick Start

1. **Install AWS CLI**: `brew install awscli`
2. **Configure AWS**: `aws configure`
3. **Create S3 bucket** (see detailed steps below)
4. **Update .env**: Copy `.env.example` and configure S3 settings

## 📋 Detailed Setup Instructions

### Step 1: AWS Account & IAM Setup

1. **Create AWS Account** if you don't have one: https://aws.amazon.com/
2. **Create IAM User** for FigMail:
   - Go to AWS Console → IAM → Users → Create User
   - Name: `figmail-s3-user`
   - Attach policies: `AmazonS3FullAccess` (or create custom policy below)

3. **Custom IAM Policy** (recommended for better security):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:HeadBucket"
            ],
            "Resource": [
                "arn:aws:s3:::figmail-assets-*",
                "arn:aws:s3:::figmail-assets-*/*"
            ]
        }
    ]
}
```

4. **Generate Access Keys**:
   - Go to IAM → Users → figmail-s3-user → Security credentials
   - Create access key → CLI usage
   - Save the Access Key ID and Secret Access Key

### Step 2: Configure AWS CLI

```bash
# Install AWS CLI
brew install awscli

# Configure with your credentials
aws configure

# Enter your details:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json
```

### Step 3: Create S3 Bucket

```bash
# Create bucket (name must be globally unique)
aws s3 mb s3://figmail-assets-yourname-$(date +%s)

# Or use AWS Console:
# 1. Go to S3 Console
# 2. Create bucket
# 3. Choose unique name: figmail-assets-yourname-12345
# 4. Select region: us-east-1 (or your preferred region)
# 5. Leave other settings as default
```

### Step 4: Configure Bucket for Public Read

**Option A: AWS CLI**
```bash
# Set bucket name
BUCKET_NAME="your-figmail-bucket-name"

# Create public read policy
cat > bucket-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME/*"
        }
    ]
}
EOF

# Replace BUCKET_NAME placeholder
sed -i '' "s/BUCKET_NAME/${BUCKET_NAME}/g" bucket-policy.json

# Apply the policy
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file://bucket-policy.json

# Enable public access
aws s3api put-public-access-block --bucket ${BUCKET_NAME} --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

**Option B: AWS Console**
1. Go to your S3 bucket
2. **Permissions** tab → **Block public access** → Edit
3. Uncheck "Block all public access" → Save changes
4. **Bucket policy** → Edit → Paste this policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```
5. Replace `YOUR-BUCKET-NAME` with your actual bucket name
6. Save changes

### Step 5: Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# S3 Configuration
S3_BUCKET=your-figmail-bucket-name
S3_PREFIX=emails
AWS_REGION=us-east-1

# Optional: Image optimization settings
MAX_IMAGE_SIZE_MB=10
IMAGE_QUALITY=85
MAX_IMAGE_WIDTH=1200
MAX_IMAGE_HEIGHT=1200
```

### Step 6: Test the Setup

```bash
# Start the backend
pnpm --filter @figmail/backend dev

# Test S3 connectivity
curl http://localhost:4000/health/s3

# Expected response:
{
  "service": "s3",
  "status": "healthy",
  "message": "Successfully connected to S3 bucket: your-bucket-name",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "config": {
    "bucket": "your-bucket-name",
    "region": "us-east-1",
    "prefix": "emails",
    "cloudfront": "not configured"
  }
}
```

## ⚡ Optional: CloudFront CDN Setup

For better performance, especially for global users:

### Step 1: Create CloudFront Distribution

1. **AWS Console** → CloudFront → Create distribution
2. **Origin domain**: Select your S3 bucket
3. **Origin access**: Origin access control settings (recommended)
4. **Default cache behavior**: Compress objects automatically = Yes
5. **Cache policy**: CachingOptimized
6. Create distribution

### Step 2: Configure Environment

```bash
# Add to .env
CLOUDFRONT_DOMAIN=abc123def456.cloudfront.net
```

### Step 3: Update Bucket Policy for CloudFront

Create an Origin Access Control (OAC) and update your bucket policy to only allow CloudFront access.

## 🔍 Troubleshooting

### Common Issues

**1. "Access Denied" errors**
- Check IAM permissions
- Verify bucket policy allows public read
- Ensure AWS credentials are correctly configured

**2. "Bucket not found"**
- Verify bucket name is correct
- Check region matches your configuration
- Ensure bucket exists and you have access

**3. "Connection timeout"**
- Check AWS region in environment variables
- Verify internet connectivity
- Try different AWS region

**4. "Image too large" errors**
- Check `MAX_IMAGE_SIZE_MB` setting
- Images are limited to 10MB by default
- Consider image optimization before upload

### Debug Commands

```bash
# Test AWS CLI connection
aws sts get-caller-identity

# List your buckets
aws s3 ls

# Test bucket access
aws s3 ls s3://your-bucket-name

# Check bucket location
aws s3api get-bucket-location --bucket your-bucket-name

# Test upload
echo "test" | aws s3 cp - s3://your-bucket-name/test.txt
```

### Health Check Diagnostics

Visit `http://localhost:4000/health/s3` to see detailed status:

- **Status**: healthy/unhealthy/error
- **Bucket**: Configuration details
- **Region**: AWS region setting
- **CloudFront**: CDN configuration

## 💰 Cost Estimation

**S3 Storage** (us-east-1):
- $0.023 per GB for first 50TB
- ~$0.02 per 1,000 PUT requests
- ~$0.0004 per 1,000 GET requests

**CloudFront** (optional):
- $0.085 per GB for first 10TB
- ~$0.0075 per 10,000 requests

**Typical usage**: Email images are small (50-500KB each). For 1,000 emails with 3 images each:
- Storage: ~$0.10/month
- Requests: ~$0.01/month
- **Total**: Less than $1/month for most use cases

## 🔒 Security Best Practices

1. **Use IAM roles** in production instead of access keys
2. **Limit bucket policy** to only necessary permissions
3. **Enable CloudTrail** for audit logging
4. **Use HTTPS** only (enforced by default)
5. **Regular access review** of IAM policies
6. **Consider bucket versioning** for backup/recovery

## 📚 Next Steps

1. **Test image upload** through Figma plugin
2. **Monitor costs** in AWS Billing Dashboard
3. **Set up CloudFront** for better performance
4. **Configure backup** strategy if needed
5. **Review security** settings periodically

For questions or issues, check the [main README](./README.md) or [create an issue](https://github.com/your-repo/issues).