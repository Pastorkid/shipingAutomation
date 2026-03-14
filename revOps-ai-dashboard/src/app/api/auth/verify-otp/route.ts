import { NextRequest, NextResponse } from 'next/server';
import api from '../../../../../lib/axios';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 VERIFY OTP API: Processing OTP verification');
    const body = await request.json();
    const { verificationCode, email, purpose = 'signup' } = body;

    // Validate required fields
    if (!verificationCode) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

    console.log('📝 VERIFY OTP API: Calling backend for email:', email, 'purpose:', purpose);

    // Call backend API using correct endpoint and parameters
    const response = await api.post('/auth/verify-email', {
      verificationCode: verificationCode,
      email, // Optional - backend can get email from OTP
      purpose,
    });

    console.log('📝 VERIFY OTP API: Backend response:', response.data);

    // Check if backend returned success: false
    if (response.data.success === false) {
      return NextResponse.json({
        success: false,
        message: response.data.message || 'OTP verification failed',
        errorCode: response.data.errorCode,
      });
    }

    // Create response with session cookie
    const responseData = {
      success: true,
      message: response.data.message || 'Email verified successfully',
      data: response.data.data,
    };

    const nextResponse = NextResponse.json(responseData);

    // Set session cookie if sessionToken is present (for signup or device verification)
    if (response.data.data?.sessionToken) {
      const sessionToken = response.data.data.sessionToken;
      console.log('🍪 Setting session cookie in frontend API route');
      
      nextResponse.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: false, // Allow HTTP in development
        sameSite: 'lax', // More compatible than 'none' for localhost
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
        domain: 'localhost', // Explicit domain for localhost
      });
      
      console.log('🍪 Session cookie set successfully in frontend');
    }

    return nextResponse;

  } catch (error: any) {
    console.log('📝 VERIFY OTP API: Error occurred:', error);
    
    // Handle axios error response
    if (error.response) {
      const errorData = error.response.data;
      console.log('📝 VERIFY OTP API: Backend error data:', errorData);

      let message = 'Failed to verify OTP';
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

      console.log('📝 VERIFY OTP API: Final error message:', message);

      return NextResponse.json(
        { 
          success: false, 
          message,
          error: errorData 
        },
        { status: 200 } // Return 200 to let frontend handle the error
      );
    }
    
    console.log('📝 VERIFY OTP API: Network/unknown error');
    return NextResponse.json(
      { success: false, message: 'Network error. Please check your connection and try again.' },
      { status: 200 } // Return 200 to let frontend handle the error
    );
  }
}
