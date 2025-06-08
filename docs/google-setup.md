# Google OAuth Setup Guide for StockArt

This guide will help you set up Google OAuth authentication for the StockArt website.

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create New Project:**
   - Click "Select a project" dropdown at the top
   - Click "New Project"
   - Project name: `StockArt Authentication`
   - Organization: Leave as default (or select your organization)
   - Click "Create"
   - Wait for project creation to complete

## Step 2: Enable Required APIs

1. **Navigate to APIs & Services:**
   - In the left sidebar, click "APIs & Services" > "Library"

2. **Enable Google Identity Services:**
   - Search for "Google Identity"
   - Click on "Google Identity Toolkit API"
   - Click "Enable"

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen:**
   - Navigate to "APIs & Services" > "OAuth consent screen"

2. **Configure User Type:**
   - Select "External" (unless you have Google Workspace)
   - Click "Create"

3. **Fill Required Information:**
   - **App name:** `StockArt`
   - **User support email:** Your email address
   - **App logo:** (Optional) Upload your app logo
   - **App domain:** Your website domain (e.g., `https://stockart.com`)
   - **Authorized domains:** Add your domain (e.g., `stockart.com`)
   - **Developer contact information:** Your email address
   - Click "Save and Continue"

4. **Scopes (Optional):**
   - For basic authentication, default scopes are sufficient
   - Click "Save and Continue"

5. **Test Users (if app is in testing):**
   - Add email addresses of users who can test the app
   - Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - Navigate to "APIs & Services" > "Credentials"

2. **Create OAuth Client ID:**
   - Click "Create Credentials" > "OAuth 2.0 Client ID"

3. **Configure Web Application:**
   - **Application type:** Web application
   - **Name:** `StockArt Web Client`
   
4. **Set Authorized Origins:**
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for local development)
     - `https://yourdomain.com` (replace with your actual domain)
   
   - **Authorized redirect URIs:** (Leave empty for this implementation)

5. **Create and Save:**
   - Click "Create"
   - **IMPORTANT:** Copy the "Client ID" - you'll need this for the website
   - Client ID format: `123456789-abcdefghijk.apps.googleusercontent.com`

## Step 5: Configure StockArt Website

1. **Update the Client ID:**
   - Open `scripts/auth.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID

```javascript
// In scripts/auth.js
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
```

2. **Test the Integration:**
   - Start your development server: `npm start`
   - Visit `http://localhost:3000`
   - Try signing in with Google

## Step 6: Production Deployment

1. **Update Authorized Origins:**
   - Go back to Google Cloud Console > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add your production domain to "Authorized JavaScript origins"
   - Example: `https://stockart.railway.app`

2. **Publish OAuth Consent Screen:**
   - Go to "OAuth consent screen"
   - Click "Publish App" when ready for production
   - This removes the "This app isn't verified" warning

## Security Best Practices

1. **Environment Variables:**
   - Store Client ID in environment variables for production
   - Never commit credentials to version control

2. **Domain Restrictions:**
   - Only add necessary domains to authorized origins
   - Regularly review and clean up unused origins

3. **Scope Minimization:**
   - Only request necessary user information
   - Current implementation only requests basic profile info

## Troubleshooting

### Common Issues:

**"Error 400: redirect_uri_mismatch"**
- Check that your domain is added to "Authorized JavaScript origins"
- Ensure protocol (http/https) matches exactly

**"This app isn't verified"**
- Normal for apps in testing mode
- Users can click "Advanced" > "Go to StockArt (unsafe)" to continue
- Publish the app to remove this warning

**Sign-in popup blocked**
- Ensure popup blockers are disabled
- Try different browsers

### Testing Checklist:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID copied to `scripts/auth.js`
- [ ] Local development domain added (`http://localhost:3000`)
- [ ] Production domain added (when deploying)
- [ ] Sign-in flow tested locally
- [ ] Sign-out flow tested
- [ ] User profile display working

## Support

For additional help:
- [Google Identity Documentation](https://developers.google.com/identity)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

---

Last updated: December 2024
