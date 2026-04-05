import { NextRequest, NextResponse } from 'next/server';

// GET - Retrieve business configuration
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      );
    }

    // Call backend API
    const API_URL = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/onboarding/business-config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch business configuration');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Business config GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch business configuration' },
      { status: 500 }
    );
  }
}

// POST - Update business configuration
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Call backend API
    const API_URL = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/onboarding/business-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie.value}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || 'Failed to update business configuration',
          errors: errorData.errors || []
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Business config POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update business configuration' },
      { status: 500 }
    );
  }
}
