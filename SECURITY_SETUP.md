# Security Setup Guide

This guide explains how to set up the secure contact form with authentication and CSRF protection.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# CSRF Protection
CSRF_SECRET=your-csrf-secret-change-in-production
```

## Demo Credentials

For testing purposes, use these credentials:
- **Email:** admin@example.com
- **Password:** admin123

## Security Features Implemented

### 1. Server-Side Proxy Pattern
- The frontend calls `/api/contact-proxy` instead of the direct API
- The proxy endpoint handles authentication and CSRF validation
- API keys and secrets are never exposed to the client

### 2. Session-Based Authentication
- Uses NextAuth.js for session management
- Requires users to sign in before submitting the contact form
- Sessions are managed server-side with JWT tokens

### 3. CSRF Protection
- Generates unique CSRF tokens for each authenticated session
- Tokens are one-time use and expire after 1 hour
- Prevents cross-site request forgery attacks

## How It Works

1. **User Authentication:**
   - User visits `/auth/signin` to authenticate
   - After successful login, they can access the contact form

2. **CSRF Token Generation:**
   - When authenticated user visits contact page, a CSRF token is generated
   - Token is stored server-side and associated with the user's session

3. **Form Submission:**
   - Contact form includes the CSRF token
   - Form submits to `/api/contact-proxy` (not the direct API)
   - Proxy validates authentication and CSRF token
   - If valid, processes the contact form submission

## API Endpoints

- `POST /api/contact-proxy` - Secure contact form submission (requires auth + CSRF)
- `GET /api/csrf-token` - Get CSRF token for authenticated user
- `POST /api/auth/signin` - User authentication
- `GET /api/auth/signin` - Sign-in page

## Security Benefits

- ✅ No API keys exposed to frontend
- ✅ Authentication required for form submission
- ✅ CSRF protection prevents malicious requests
- ✅ Server-side validation and processing
- ✅ Session-based security
- ✅ One-time use tokens prevent replay attacks

## Production Considerations

1. **Change Default Secrets:**
   - Update `NEXTAUTH_SECRET` and `CSRF_SECRET` with strong, random values
   - Use environment-specific secrets for different deployments

2. **Database Integration:**
   - Replace in-memory CSRF token storage with Redis or database
   - Implement proper user management and password hashing

3. **Rate Limiting:**
   - Add rate limiting to prevent abuse
   - Consider implementing CAPTCHA for additional protection

4. **HTTPS:**
   - Ensure all communication uses HTTPS in production
   - Update `NEXTAUTH_URL` to use HTTPS

5. **Monitoring:**
   - Add logging for security events
   - Monitor for suspicious activity
