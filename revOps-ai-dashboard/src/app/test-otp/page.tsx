'use client';

import { useRouter } from 'next/navigation';

export default function TestOtpPage() {
  const router = useRouter();

  const testCases = [
    {
      name: 'Signup Verification',
      email: 'test@example.com',
      purpose: 'signup',
      description: '4 minutes timeout - Fully Supported'
    },
    {
      name: 'Login Verification', 
      email: 'test@example.com',
      purpose: 'login',
      description: '5 minutes timeout - Now Supported'
    },
    {
      name: 'Device Verification',
      email: 'test@example.com', 
      purpose: 'device_verification',
      description: '10 minutes timeout - Now Supported'
    },
    {
      name: 'Password Reset',
      email: 'test@example.com',
      purpose: 'password_reset',
      description: '15 minutes timeout - Now Supported'
    }
  ];

  const handleTest = (email: string, purpose: string) => {
    const reference = 'test-ref-' + Date.now();
    router.push(`/verifyOtp?email=${encodeURIComponent(email)}&purpose=${purpose}&reference=${reference}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">OTP Verification Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testCases.map((testCase) => (
            <div key={testCase.name} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{testCase.name}</h2>
              <p className="text-gray-600 mb-4">{testCase.description}</p>
              <p className="text-sm text-gray-500 mb-4">Email: {testCase.email}</p>
              <p className="text-sm text-gray-500 mb-4">Purpose: {testCase.purpose}</p>
              <button
                onClick={() => handleTest(testCase.email, testCase.purpose)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Test {testCase.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ ALL PURPOSES NOW SUPPORTED!</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Signup Verification</strong> - Email verification with 4-minute timeout</li>
            <li>• <strong>Login Verification</strong> - 2FA login with 5-minute timeout</li>
            <li>• <strong>Device Verification</strong> - New device verification with 10-minute timeout</li>
            <li>• <strong>Password Reset</strong> - Password reset with 15-minute timeout</li>
            <li>• Backend now handles all purposes with appropriate logic</li>
          </ul>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Test Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click any test button to test different OTP verification purposes</li>
            <li>• Each purpose shows different content and timeout durations</li>
            <li>• Try entering a 5-digit code to test validation</li>
            <li>• Test the countdown timer and resend functionality</li>
            <li>• Verify all text is translated correctly</li>
            <li>• Password reset will redirect to reset page with token</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
