# Mailchimp OAuth2 Setup Guide

This guide will help you set up proper OAuth2 authentication for FigChimp with Mailchimp.

## 🚀 Prerequisites

1. **Mailchimp Account**: You need an active Mailchimp account
2. **Developer Access**: Register as a Mailchimp developer
3. **Node.js**: Version 20+ with pnpm package manager

## 📋 Step 1: Create Mailchimp App

1. Go to [Mailchimp Developer Portal](https://developer.mailchimp.com/)
2. Click **"Create App"**
3. Fill in the app details:
   - **App name**: FigChimp
   - **App description**: Figma to Mailchimp email converter
   - **App website**: `http://localhost:4000` (for development)
   - **Redirect URI**: `http://localhost:4000/auth/mailchimp/callback`

4. **Copy the credentials**:
   - **Client ID**: Save this for your `.env` file
   - **Client Secret**: Save this securely for your `.env` file

## 🔧 Step 2: Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Mailchimp OAuth2 Configuration (Required)
MC_CLIENT_ID=your_mailchimp_client_id_here
MC_CLIENT_SECRET=your_mailchimp_client_secret_here
MC_REDIRECT_URI=http://localhost:4000/auth/mailchimp/callback

# Session Configuration (Required)
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Email Defaults (Recommended)
DEFAULT_REPLY_TO=hello@yourdomain.com

# Optional: AWS S3 for asset hosting (falls back to data URIs if not configured)
S3_BUCKET=your-bucket-name
S3_PREFIX=emails
AWS_REGION=us-east-1

# Optional: Debug settings
DEBUG=true
DEBUG_LEVEL=info

# Optional: Server configuration
PORT=4000
NODE_ENV=development
```

## 🚀 Step 3: Install Dependencies

The OAuth dependencies are already installed. If you need to reinstall:

```bash
cd packages/backend
pnpm install
```

## 🎯 Step 4: Test the OAuth Flow

1. **Start the backend server**:
   ```bash
   pnpm --filter @figmc/backend dev
   ```

2. **Open your browser** to `http://localhost:4000/auth/mailchimp/status` to check the status endpoint

3. **Test OAuth initiation**:
   - Visit `http://localhost:4000/auth/mailchimp/start`
   - This should redirect you to Mailchimp's authorization page
   - Grant permission for FigChimp
   - You should be redirected back to the callback URL

## 🧪 Step 5: Test in Figma Plugin

1. **Build the plugin**:
   ```bash
   pnpm --filter @figmc/plugin build
   ```

2. **Load the plugin in Figma**:
   - Open Figma Desktop
   - Go to `Plugins → Development → Import plugin from manifest...`
   - Select `packages/plugin/manifest.json`

3. **Test the connection**:
   - Click "Connect Mailchimp" in the plugin
   - A browser window should open with Mailchimp's OAuth page
   - Complete the authorization
   - Return to the plugin (connection status should update)

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Client ID is required"
- Make sure `MC_CLIENT_ID` is set in your `.env` file
- Restart the backend server after changing environment variables

#### 2. "Invalid redirect URI"
- Ensure the redirect URI in your `.env` matches exactly what you configured in the Mailchimp app
- The URI should be: `http://localhost:4000/auth/mailchimp/callback`

#### 3. "Session expired" or authentication issues
- Try clearing your browser cookies for localhost
- Restart the backend server
- Check that `SESSION_SECRET` is set

#### 4. Plugin doesn't open OAuth page
- Make sure the backend server is running on port 4000
- Check that the plugin build is up to date
- Try reloading the plugin in Figma

### Debug Mode:

Enable debug logging by setting:
```bash
DEBUG=true
DEBUG_LEVEL=debug
```

Check the backend console for detailed error messages.

## 🔒 Security Best Practices

### For Development:
- Use `http://localhost:4000` for redirect URI
- Keep your `.env` file out of version control
- Use a strong `SESSION_SECRET`

### For Production:
- Use HTTPS URLs for redirect URI
- Store secrets in environment variables (not in code)
- Use a secure, randomly generated `SESSION_SECRET`
- Enable `secure: true` for session cookies
- Set `NODE_ENV=production`

## 📚 API Endpoints

The OAuth system provides these endpoints:

- `GET /auth/mailchimp/start` - Initiate OAuth flow
- `GET /auth/mailchimp/callback` - Handle OAuth callback
- `GET /auth/mailchimp/status` - Check authentication status
- `GET /auth/mailchimp/user` - Get user account info
- `POST /auth/mailchimp/disconnect` - Disconnect account

## 🎉 Success!

Once set up correctly, your users will be able to:
1. Click "Connect Mailchimp" in the Figma plugin
2. Authorize FigChimp access to their Mailchimp account
3. Use the plugin to convert Figma designs to Mailchimp templates
4. Create draft campaigns directly from Figma

The OAuth flow ensures secure, per-user authentication without requiring users to share API keys manually.
