import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_LOCAL_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, toolType, config, toolId, dataMapping, syncSettings } = body;

    console.log('🔗 Connect Tools API Request:', { action, toolType, toolId, dataMapping, syncSettings });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/connect-tools/manage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        action,
        toolType,
        config,
        toolId,
        dataMapping,
        syncSettings
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Connect Tools API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log(' Get Connected Tools API Request');

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/connect-tools`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error(' Get Connected Tools API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}