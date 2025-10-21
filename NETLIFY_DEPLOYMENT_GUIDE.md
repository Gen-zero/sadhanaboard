# Netlify Deployment Guide for Sadhanaboard

This guide provides step-by-step instructions for deploying the Sadhanaboard project on Netlify.

## Prerequisites

1. A Netlify account (free or paid tier)
2. Access to the GitHub repository: https://github.com/Gen-zero/sadhanaboard
3. Environment variables (provided separately)

## Deployment Steps

### 1. Connect Repository to Netlify

1. Log in to your Netlify account
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" as your Git provider
4. Search for and select the "Gen-zero/sadhanaboard" repository
5. Click "Deploy site"

### 2. Configure Build Settings

Netlify should automatically detect the following settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist/`

If these are not automatically detected:
1. Go to Site settings → Build & deploy → Continuous Deployment
2. Click "Edit settings"
3. Set:
   - Build command: `npm run build`
   - Publish directory: `dist/`

### 3. Configure Environment Variables

Add the following environment variables in Netlify:

1. Go to Site settings → Build & deploy → Environment
2. Click "Edit variables"
3. Add the following variables:

```
VITE_APP_API_URL=your_api_url
VITE_APP_FIREBASE_API_KEY=your_firebase_api_key
VITE_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_FIREBASE_APP_ID=your_firebase_app_id
VITE_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

Note: Replace the values with your actual environment variables.

### 4. Custom Domain Setup (sadhanaboard.com)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter "sadhanaboard.com"
4. Follow Netlify's DNS configuration instructions
5. Update your domain registrar's DNS settings as per Netlify's instructions

### 5. SSL Certificate

Netlify automatically provisions SSL certificates for custom domains:
1. The certificate will be automatically provisioned after DNS propagation
2. No additional action is required

## Troubleshooting

### Build Failures

If you encounter build failures:

1. Check the build logs in Netlify for specific error messages
2. Ensure all environment variables are correctly set
3. Verify that the repository is up to date with the latest fixes
4. Clear the build cache if needed:
   - Site settings → Build & deploy → Continuous Deployment → Clear cache and retry build

### Common Issues

1. **Dependency conflicts**: 
   - These have been resolved in the latest code
   - Ensure you're using the updated package.json

2. **TypeScript compilation errors**:
   - All TypeScript errors have been fixed
   - Make sure you're deploying the latest code

3. **Environment variables not found**:
   - Double-check that all required environment variables are set
   - Ensure variable names match exactly (case-sensitive)

## Post-Deployment

1. Test the deployed site thoroughly
2. Verify all functionality works as expected
3. Check that all environment variables are correctly loaded
4. Monitor the site for any runtime errors using browser developer tools

## Updating the Site

To update the deployed site:

1. Push changes to the GitHub repository
2. Netlify will automatically trigger a new build
3. Monitor the build progress in the Netlify dashboard

## Additional Configuration

### Redirects

The project includes a `_redirects` file in the public directory for client-side routing. No additional Netlify configuration is needed for this.

### Headers

The project includes a `_headers` file in the public directory for security and performance optimizations. No additional Netlify configuration is needed for this.

## Support

For any deployment issues, contact the development team with:
1. Screenshots of error messages
2. Build logs from Netlify
3. Description of steps taken