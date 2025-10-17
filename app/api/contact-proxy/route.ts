import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { validateCSRFToken } from '@/lib/csrf';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, message, csrfToken } = body;

    // Validate CSRF token
    if (!csrfToken || !validateCSRFToken(session.user.id, csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current date and time
    const receivedAt = new Date().toISOString();
    const formattedDate = new Date(receivedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    // Here you can add additional server-side processing:
    // - Save to database
    // - Send email notification
    // - Log the message
    // - Integrate with external services
    
    // For now, we'll just log the message and return the timestamp
    console.log('Contact form submission received:', {
      name,
      email,
      message,
      receivedAt: formattedDate,
      userId: session.user.id,
      userEmail: session.user.email
    });

    // Return success response with timestamp
    return NextResponse.json({
      success: true,
      message: 'Message received successfully!',
      receivedAt: formattedDate,
      timestamp: receivedAt
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
