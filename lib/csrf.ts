import { randomBytes, createHmac } from 'crypto';

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < now) {
      csrfTokens.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function generateCSRFToken(sessionId: string): string {
  const secret = process.env.CSRF_SECRET || 'default-secret-change-in-production';
  const randomToken = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  
  // Create HMAC signature
  const hmac = createHmac('sha256', secret);
  hmac.update(randomToken + timestamp + sessionId);
  const signature = hmac.digest('hex');
  
  const token = `${randomToken}.${timestamp}.${signature}`;
  
  // Store token with expiration (1 hour)
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 60 * 60 * 1000
  });
  
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored || stored.expires < Date.now()) {
    return false;
  }
  
  if (stored.token !== token) {
    return false;
  }
  
  // Remove token after use (one-time use)
  csrfTokens.delete(sessionId);
  return true;
}

export function getCSRFToken(sessionId: string): string | null {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored || stored.expires < Date.now()) {
    return null;
  }
  
  return stored.token;
}
