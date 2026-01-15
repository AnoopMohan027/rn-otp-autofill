# React Native Mobile Login with OTP Auto-Fill

A complete mobile authentication system featuring phone number verification and automatic OTP detection from SMS. Built with React Native and `react-native-otp-verify` for a seamless user experience.

## Features

- 📱 **Two-Step Authentication Flow** - Phone number entry → OTP verification
- 🤖 **Automatic OTP Detection** - Reads OTP directly from SMS (Android)
- ⏱️ **Smart Resend Timer** - 30-second countdown prevents spam
- ✅ **Real-time Validation** - Phone number and OTP input validation
- 🔄 **Auto-Verification** - Verifies OTP as soon as all digits are entered
- ⌨️ **Smart Navigation** - Auto-focus between input fields
- 📋 **Paste Support** - Quick paste for OTP codes
- 🎨 **Modern UI** - Clean, professional design
- 💬 **Toast Notifications** - User-friendly feedback messages
- 🔐 **Success Screen** - Confirms successful authentication

## Installation

```bash
npm install
npm install react-native-otp-verify
```

For iOS:
```bash
cd ios && pod install && cd ..
```

## Configuration

### Android Setup

Add permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

### Get App Hash

Run the app and check console logs for your app hash. Include this hash in your SMS messages.

### SMS Format

```
<#> Your verification code is: 123456
YOUR_APP_HASH_HERE
```

## Usage

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native';
import MobileLoginScreen from './MobileLoginScreen';

const App = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MobileLoginScreen />
        </SafeAreaView>
    );
};

export default App;
```

## Authentication Flow

### Step 1: Phone Number Entry
- Enter country code (default: +91)
- Enter 10-digit mobile number
- Real-time validation
- "Send OTP" button activates when valid

### Step 2: OTP Verification
- Automatic OTP detection from SMS
- 6 individual input boxes
- Smart keyboard navigation
- 30-second resend timer
- Edit phone number option

### Step 3: Success
- Toast notification on successful verification
- Success screen display
- Ready for app navigation

## Key Features

### Automatic OTP Detection
```javascript
useEffect(() => {
    if (Platform.OS === 'android') {
        getHash();
        startListeningForOTP();
    }
    return () => RNOtpVerify.removeListener();
}, []);
```

### Auto-Verification
OTP is automatically verified when all 6 digits are entered:
```javascript
if (index === 5 && value) {
    const otpString = [...newOtp.slice(0, 5), value].join('');
    handleVerifyOTP(otpString);
}
```

### Smart Input Navigation
- Auto-focus next field on digit entry
- Backspace moves to previous field
- Paste support for quick entry

### Resend Timer
- 30-second countdown
- Shows remaining time
- Enables resend button when complete
- Prevents OTP spam

## Component Structure

```
MobileLoginScreen
├── Phone Input Screen
│   ├── Country Code Input (+91)
│   ├── Phone Number Input (10 digits)
│   └── Send OTP Button
├── OTP Verification Screen
│   ├── 6-digit OTP Input Boxes
│   ├── Edit Phone Number Option
│   ├── Resend Timer/Button
│   └── Verify Button
└── Success Screen
    └── Success Message
```

## Running the App

```bash
# Android
npm run android

# iOS
npm run ios
```

## Testing

### Test OTP Auto-fill (Android)
```bash
adb emu sms send +1234567890 "<#> Your OTP is: 123456 YourAppHash"
```

### Manual Testing
1. Enter phone number: `9876543210`
2. Click "Send OTP"
3. Enter OTP manually or wait for auto-fill
4. Automatic verification on completion

## Customization

### Change Timer Duration
```javascript
const startTimer = () => {
    setTimer(60); // Change from 30 to 60 seconds
    setCanResend(false);
    // ...
};
```

### Modify OTP Length
```javascript
const [otp, setOtp] = useState(['', '', '', '']); // 4 digits instead of 6
```

### Update Country Code
```javascript
const [countryCode, setCountryCode] = useState('+1'); // US instead of India
```

### Change Phone Number Length
```javascript
const isValidPhone = () => {
    return phoneNumber.length === 11 && /^\d+$/.test(phoneNumber);
};
```

**Made with ❤️ using React Native**
