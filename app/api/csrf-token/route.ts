import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateCSRFToken } from '@/lib/csrf';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate CSRF token
    const csrfToken = generateCSRFToken(session.user.id);

    return NextResponse.json({
      csrfToken
    });

  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
