# OTP Verification Page

This page handles OTP (One-Time Password) verification for different purposes in the RevOps AI application.

## Features

### ✅ **Multi-Purpose OTP Support**
- **Signup Verification** - 4 minutes timeout
- **Login Verification** - 5 minutes timeout  
- **Device Verification** - 10 minutes timeout
- **Password Reset** - 15 minutes timeout

### ✅ **Responsive Design**
- Mobile-first approach
- Touch-friendly OTP input
- Proper centering on all devices
- Consistent theming with signup/login pages

### ✅ **User Experience**
- 5-digit OTP input with auto-focus
- Paste support for quick entry
- Backspace navigation between inputs
- Real-time countdown timer
- Resend code functionality
- Success/error handling with animations

### ✅ **Internationalization**
Full translation support for:
- English (en)
- Spanish (es) 
- French (fr)
- German (de)
- Japanese (ja)
- Portuguese (pt)
- Chinese (zh)

## Usage

### URL Parameters
The page accepts the following query parameters:

```
/verifyOtp?email=user@example.com&purpose=signup&reference=abc123
```

- **email** (required) - User's email address
- **purpose** (required) - One of: `signup`, `login`, `device_verification`, `password_reset`
- **reference** (optional) - OTP reference from backend

### API Integration

The page integrates with two API endpoints:

#### 1. Verify OTP
```
POST /api/auth/verify-otp
{
  "verification_code": "12345",
  "email": "user@example.com", 
  "reference": "abc123",
  "purpose": "signup"
}
```

#### 2. Request New OTP
```
POST /api/auth/request-otp
{
  "email": "user@example.com",
  "purpose": "signup"
}
```

## Redirection Logic

After successful verification, users are redirected based on purpose:

- **signup** → `/dashboard`
- **login** → `/dashboard` (with tokens stored)
- **device_verification** → `/dashboard`
- **password_reset** → `/reset-password?token=xyz`

## Styling

The page follows the app's design system:
- Uses CSS variables for theming (`var(--background)`, `var(--surface)`, etc.)
- Framer Motion for smooth animations
- Lucide React icons
- Tailwind CSS for responsive design

## Security Features

- 5-digit numeric OTP only
- Automatic timeout based on purpose
- Rate limiting on resend requests
- Secure token handling for login flows
- Input validation and sanitization

## Example Implementation

```tsx
// Redirect to OTP verification
router.push('/verifyOtp?email=user@example.com&purpose=signup&reference=abc123');
```

The page will automatically:
1. Display the appropriate title and description based on purpose
2. Set the correct countdown timer
3. Handle verification and redirection
4. Show translated content based on user's language preference
