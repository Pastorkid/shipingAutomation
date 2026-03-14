import { NextRequest, NextResponse } from 'next/server';
import api from '../../../../../lib/axios';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 REQUEST OTP API: Processing OTP request');
    const body = await request.json();
    const { email, purpose = 'signup' } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('📝 REQUEST OTP API: Calling backend for email:', email, 'purpose:', purpose);

    // Call backend API using axios with session support
    const response = await api.post('/auth/resend-verification', {
      email,
      purpose,
    });

    console.log('📝 REQUEST OTP API: Backend response:', response.data);

    return NextResponse.json({
      success: true,
      message: response.data.message || 'OTP sent successfully',
      data: response.data.data,
    });

  } catch (error: any) {
    console.log('📝 REQUEST OTP API: Error occurred:', error);
    
    // Handle axios error response
    if (error.response) {
      const errorData = error.response.data;
      console.log('📝 REQUEST OTP API: Backend error data:', errorData);

      let message = 'Failed to send OTP';
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          message = errorData.message.join(', ');
        } else {
          message = errorData.message;
        }
        if (errorData.errorCode === 'INTERNAL_SERVER_ERROR') {
          message += ' (Server error - please try again later)';
        } else if (errorData.status === false && errorData.errorCode) {
          message += ` (${errorData.errorCode})`;
        }
      } else if (errorData.error) {
        message = errorData.error;
      } else if (errorData.errors && Array.isArray(errorData.errors)) {
        message = errorData.errors.join(', ');
      }

      console.log('📝 REQUEST OTP API: Final error message:', message);

      return NextResponse.json(
        { 
          success: false, 
          message,
          error: errorData 
        },
        { status: 200 } // Return 200 to let frontend handle the error
      );
    }
    
    console.log('📝 REQUEST OTP API: Network/unknown error');
    return NextResponse.json(
      { success: false, message: 'Network error. Please check your connection and try again.' },
      { status: 200 } // Return 200 to let frontend handle the error
    );
  }
}
