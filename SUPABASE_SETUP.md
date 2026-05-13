# Supabase Authentication Setup Guide

This guide walks you through setting up Supabase authentication for the M2SQL application.

## Overview

The M2SQL app uses Supabase for secure user authentication, supporting:
- Email/password authentication with email verification
- OAuth providers (Google and GitHub)
- Password reset functionality
- Session management with "Remember me" option

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `m2sql` (or your preferred name)
   - **Database Password**: Generate a strong password (save this securely)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for project to be provisioned (2-3 minutes)

---

## Step 2: Get Project Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) > **API**
2. Find these values:
   - **Project URL**: Under "Project URL" (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Under "Project API keys" > "anon public"
3. Copy these values to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```

---

## Step 3: Configure Email Authentication

### Enable Email Provider

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Find **Email** in the list
3. Toggle it **ON** if not already enabled

### Configure Email Settings (Optional but Recommended)

1. Go to **Authentication** > **Email Templates**
2. Customize these templates:
   
   **Confirm signup**:
   - Subject: `Verify your M2SQL account`
   - Body: Customize with your branding
   
   **Reset password**:
   - Subject: `Reset your M2SQL password`
   - Body: Customize with instructions

3. **SMTP Settings** (for production):
   - By default, Supabase rate-limits emails (3-4 per hour per user)
   - For production, configure custom SMTP in **Settings** > **Auth** > **SMTP Settings**
   - Recommended: Use SendGrid, AWS SES, or Mailgun

### Email Confirmation Settings

1. Go to **Authentication** > **Settings**
2. Find **"Email Confirmation"** section
3. Options:
   - ✅ **Enable email confirmations**: Recommended (requires users to verify email before login)
   - ⚠️ Disable only for development/testing

---

## Step 4: Configure OAuth Providers (Optional)

### Google OAuth

1. **Create Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Go to **APIs & Services** > **Credentials**
   - Click **"Create Credentials"** > **"OAuth client ID"**
   - Application type: **Web application**
   - Add **Authorized redirect URI**:
     ```
     https://[your-project-ref].supabase.co/auth/v1/callback
     ```
     (Replace `[your-project-ref]` with your Supabase project reference ID from Project Settings > General)
   - Click **Create** and copy **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** > **Providers** > **Google**
   - Toggle **ON**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

### GitHub OAuth

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings > **Developer settings** > **OAuth Apps**
   - Click **"New OAuth App"**
   - Fill in:
     - **Application name**: `M2SQL`
     - **Homepage URL**: `http://localhost:3000` (or your production URL)
     - **Authorization callback URL**:
       ```
       https://[your-project-ref].supabase.co/auth/v1/callback
       ```
   - Click **Register application**
   - Copy **Client ID**
   - Generate **Client Secret** and copy it

2. **Configure in Supabase**:
   - Go to **Authentication** > **Providers** > **GitHub**
   - Toggle **ON**
   - Paste **Client ID** and **Client Secret**
   - Click **Save**

---

## Step 5: Configure Site URL

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: Your deployed domain (e.g., `https://m2sql.vercel.app`)
3. Add **Redirect URLs** (comma-separated):
   ```
   http://localhost:3000/**,https://yourdomain.com/**
   ```

---

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000](http://localhost:3000)

3. You should be redirected to the login page

4. **Test Email/Password Signup**:
   - Click "Sign up"
   - Enter email and password
   - Check your email for verification link
   - Click link to verify
   - Return to app and login

5. **Test OAuth** (if configured):
   - Click "Continue with Google" or "Continue with GitHub"
   - Authorize the app
   - Should redirect back to app logged in

---

## Security Best Practices

### Production Checklist

- [ ] Enable **RLS (Row Level Security)** on all tables if storing user data
- [ ] Use custom SMTP provider (not Supabase default)
- [ ] Configure **rate limiting** in Authentication settings
- [ ] Enable **CAPTCHA** protection (Settings > Auth > Bot Protection)
- [ ] Set strong **password requirements** (minimum 8 characters already enforced)
- [ ] Configure **session timeout** (Settings > Auth > Sessions)
- [ ] Use **HTTPS only** for Site URL in production
- [ ] Rotate **API keys** periodically
- [ ] Monitor **Auth logs** for suspicious activity

### Environment Variables

**Never commit `.env.local` to git!**

For team members:
1. Share `.env.example` (with placeholder values)
2. Each developer gets their own Supabase credentials
3. For production, use environment variables in deployment platform (Vercel, Netlify, etc.)

---

## Troubleshooting

### "Invalid supabaseUrl" Error

**Problem**: Environment variables not set or invalid

**Solution**:
1. Check `.env.local` exists in project root
2. Verify `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
3. Restart dev server after changing `.env.local`

### Email Not Received

**Problem**: Email stuck in spam or rate limited

**Solutions**:
1. Check spam/junk folder
2. Wait a few minutes (rate limiting)
3. Check Supabase logs: **Authentication** > **Logs**
4. For production, configure custom SMTP

### OAuth Error: "redirect_uri_mismatch"

**Problem**: Callback URL doesn't match OAuth app configuration

**Solution**:
1. Ensure callback URL in Google/GitHub matches exactly:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
2. No trailing slashes
3. Wait a few minutes for changes to propagate

### "Email not confirmed" Error

**Problem**: User trying to login before verifying email

**Solutions**:
1. Resend verification email from signup page
2. Disable email confirmation temporarily (dev only):
   - Settings > Auth > Email Confirmation > Disable

### Session Not Persisting

**Problem**: User logged out after closing browser

**Solution**:
- Ensure "Remember me" checkbox is checked during login
- Session storage is controlled at Supabase client level

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/server-side-rendering)

---

## Support

For issues specific to M2SQL authentication, check:
- [GitHub Issues](your-repo-url/issues)
- [Supabase Discord](https://discord.supabase.com/)

For Supabase-specific issues:
- [Supabase Support](https://supabase.com/support)
