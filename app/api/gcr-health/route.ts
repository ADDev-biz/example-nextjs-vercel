import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const gcrSystemUrl = process.env.GCR_SYSTEM;
    const gcrSystemKey = process.env.GCR_SYSTEM_KEY;

    // Validate environment variables
    if (!gcrSystemUrl) {
      return NextResponse.json(
        { error: 'GCR_SYSTEM environment variable is not configured' },
        { status: 500 }
      );
    }

    if (!gcrSystemKey) {
      return NextResponse.json(
        { error: 'GCR_SYSTEM_KEY environment variable is not configured' },
        { status: 500 }
      );
    }

    // Construct the health endpoint URL
    const healthUrl = `${gcrSystemUrl}/health`;

    // Make the API call to the GCR system
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${gcrSystemKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Get the response data
    const responseData = await response.json();

    // Return the response with the same status code
    return NextResponse.json(responseData, { 
      status: response.status 
    });

  } catch (error) {
    console.error('Error calling GCR health endpoint:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to GCR system',
          details: 'Network error or invalid URL'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
