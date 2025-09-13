# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FigMail is a Figma plugin that converts Figma email designs into responsive HTML emails and publishes them to Mailchimp. It's a TypeScript monorepo with three packages:

- **@figmail/shared**: Zod schemas for email AST validation (packages/shared)
- **@figmail/backend**: Express API server for compilation and Mailchimp integration (packages/backend)
- **@figmail/plugin**: Figma plugin with React UI (packages/plugin)

## Development Commands

### Workspace Commands (run from root)
```bash
pnpm install                                    # Install all dependencies
pnpm --filter @figmail/backend dev             # Run backend development server
pnpm --filter @figmail/plugin dev              # Run plugin development build
pnpm --filter @figmail/shared build            # Build shared types package
pnpm --filter @figmail/shared dev              # Build shared types in watch mode
```

### Package-specific Commands
```bash
# Backend (packages/backend)
pnpm dev                # Start dev server with tsx watch (port 4000)
pnpm build             # TypeScript compilation

# Plugin (packages/plugin)
pnpm dev               # Vite development build
pnpm build             # Full plugin build (code.js + UI)
pnpm build:code        # Build only plugin controller
pnpm build:ui          # Build only plugin UI

# Shared (packages/shared)
pnpm build             # Build TypeScript types
pnpm dev               # Build in watch mode
```

## Architecture

### Email AST System
The core of FigMail is an Abstract Syntax Tree (AST) defined in `packages/shared/src/ast.ts` using Zod schemas. The flow is:

1. **Plugin** (`packages/plugin/src/code.ts`): Traverses Figma design → generates EmailAst
2. **Backend** (`packages/backend/src/services/astToMjml.ts`): EmailAst → MJML → HTML
3. **Mailchimp API** (`packages/backend/src/services/mailchimp.ts`): Publishes to Mailchimp

### Block Types
- **TextBlock**: Text with typography, support for merge tags and editable regions
- **ImageBlock**: Images with S3 upload support
- **ButtonBlock**: Styled buttons with links and editable text
- **ContainerBlock**: Background color containers
- **DividerBlock**: Horizontal dividers
- **SpacerBlock**: Vertical spacing

### Services Architecture
- **astToMjml.ts**: Core compiler (AST → MJML → HTML)
- **assets.ts**: Enhanced image processing with S3 uploads, retry logic, and format detection
- **mergeTags.ts**: Mailchimp merge tag conversion (`{{first_name}}` → `*|FNAME|*`)
- **mailchimp.ts**: Mailchimp API wrapper for templates and campaigns

### Image Processing Features
- **Format Detection**: Automatically detects PNG, JPG, GIF, WebP formats
- **Unique Filenames**: Prevents conflicts with timestamp + hash generation
- **Size Validation**: Configurable max file size (default 10MB)
- **Retry Logic**: 3 attempts with exponential backoff for failed uploads
- **Fallback Strategy**: Uses data URIs if S3 upload fails
- **CloudFront Support**: Optional CDN integration for faster image delivery
- **Metadata Tracking**: Stores upload timestamp, file size, and source info

### Authentication
Uses Mailchimp OAuth2 flow with session-based storage. For development, static tokens can be used via `MC_ACCESS_TOKEN` env var.

## Key Configuration Files

- **pnpm-workspace.yaml**: Defines monorepo packages
- **tsconfig.json**: Project references for TypeScript
- **packages/plugin/manifest.json**: Figma plugin manifest
- **packages/plugin/vite.config.ts**: Plugin build configuration
- **.env**: Environment variables (not committed, see OAUTH_SETUP.md)

## Figma Design Conventions

The plugin follows specific Figma naming conventions defined in FIGMA_CONVENTIONS.md:

- **Email/Button/[Name]**: Creates button blocks with optional links
- **Email/Image/[Name]**: Exports as optimized images
- **Email/Column/[Width]**: Multi-column layouts (50%, 33%, Left, Right, etc.)
- **Email/SectionFull**: Full-width sections
- **Text layers**: Become editable regions in Mailchimp templates

## Environment Setup

Copy `.env.example` to `.env` and configure:

### Mailchimp Authentication
```bash
# OAuth2 (recommended for production)
MC_CLIENT_ID=your_mailchimp_client_id
MC_CLIENT_SECRET=your_mailchimp_client_secret
MC_REDIRECT_URI=http://localhost:4000/auth/mailchimp/callback
SESSION_SECRET=your-session-secret

# OR Static token (development only)
MC_ACCESS_TOKEN=your_mailchimp_access_token
MC_DC=usXX
```

### AWS S3 Setup (for image hosting)
S3 upload is fully implemented and provides better performance than data URIs.

**Option 1: AWS CLI (Recommended for Development)**
```bash
# Install and configure AWS CLI
brew install awscli
aws configure  # Enter your AWS access key, secret, region

# In .env file
S3_BUCKET=figmail-assets-your-unique-suffix
S3_PREFIX=emails
AWS_REGION=us-east-1
```

**Option 2: Environment Variables**
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET=figmail-assets-your-unique-suffix
S3_PREFIX=emails
AWS_REGION=us-east-1
```

**S3 Bucket Setup:**
1. Create an S3 bucket in AWS Console
2. Enable public read access for the bucket
3. Optionally set up CloudFront CDN: `CLOUDFRONT_DOMAIN=your-domain.cloudfront.net`

**Health Check Endpoints:**
- `GET /health` - Basic server health
- `GET /health/s3` - S3 connection and configuration status

## Testing

The repository includes test files in the root directory:
- `test-mjml.js`: MJML compilation testing
- `test-multi-column.js`: Multi-column layout testing
- `test-download-feature.js`: HTML download functionality
- `test-template-insertion.js`: Template insertion testing

Run tests with `node [test-file.js]` after starting the backend server.

## Plugin Development

To develop the Figma plugin:
1. Run `pnpm --filter @figmail/plugin dev` for hot reloading
2. In Figma: Plugins → Development → Import plugin from manifest
3. Select `packages/plugin/manifest.json`
4. Make changes to `packages/plugin/src/` files
5. Plugin auto-rebuilds via Vite

The plugin has two main parts:
- **code.ts**: Plugin controller (runs in Figma's sandbox)
- **ui/**: React interface (runs in iframe)