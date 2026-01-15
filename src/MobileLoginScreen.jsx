import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';


const SuccessComponent = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>
        OTP verified successfully!
      </Text>
    </View>
  )
}

const MobileLoginScreen = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isTrue, setIsTrue] = useState(false)
  const otpInputRefs = useRef([]);
  const timerRef = useRef(null);

  // Phone number validation
  const isValidPhone = () => {
    return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  };


  // Send OTP
  const handleSendOTP = async () => {
    if (!isValidPhone()) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      startTimer();
      ToastAndroid.showWithGravity(
        'OTP Sent',
        ToastAndroid.CENTER,
        ToastAndroid.BOTTOM,
      );
      // Alert.alert('OTP Sent', `Verification code sent to ${countryCode} ${phoneNumber}`);
    }, 1500);

    // TODO: Replace with your actual API call
    // try {
    //   const response = await fetch('YOUR_API_ENDPOINT/send-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       phoneNumber: countryCode + phoneNumber 
    //     }),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     setStep('otp');
    //     startTimer();
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to send OTP');
    // } finally {
    //   setLoading(false);
    // }
  };

  // Start resend timer
  const startTimer = () => {
    setTimer(30);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };



  useEffect(() => {
    if (Platform.OS === 'android') {
      getHash();
      startListeningForOTP();
    }

    return () => {
      if (Platform.OS === 'android') {
        RNOtpVerify.removeListener();
      }
    };
  }, []);

  const getHash = () => {
    RNOtpVerify.getHash()
      .then(hash => {
        console.log('App Hash:', hash);
        // Send this hash to your backend to include in SMS
      })
      .catch(error => console.log('Error getting hash:', error));
  };

  const startListeningForOTP = () => {
    RNOtpVerify.getOtp()
      .then(() => RNOtpVerify.addListener(otpHandler))
      .catch(error => console.log('Error starting OTP listener:', error));
  };

  const otpHandler = (message) => {
    if (message) {
      const otpMatch = /(\d{6})/g.exec(message);
      console.log('otpMatch', otpMatch)
      if (otpMatch) {
        const extractedOTP = otpMatch[1];
        autoFillOTP(extractedOTP);
        RNOtpVerify.removeListener();
      }
    }
  };
  const autoFillOTP = (otpString) => {
    const otpArray = otpString.split('');
    setOtp(otpArray);
    // Focus the last input after auto-fill
    if (otpInputRefs.current[5]) {
      otpInputRefs.current[5].focus();
    }
    handleVerifyOTP(otpArray)
  };
  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (index === 5 && value) {
      const otpString = [...newOtp.slice(0, 5), value].join('');
      handleVerifyOTP(otpString);
    }
  };

  // Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpString) => {
    const otpValue = otpString || otp.join('');

    if (otpValue.length !== 6) {
      // Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Alert.alert('Success', 'Login successful!');
      // Navigate to home screen
      ToastAndroid.showWithGravity(
        'OTP verified successfully',
        ToastAndroid.CENTER,
        ToastAndroid.BOTTOM,
      );

    }, 1500);
    setTimeout(() => {
      setIsTrue(true)
    }, 2500);

    // TODO: Replace with your actual API call
    // try {
    //   const response = await fetch('YOUR_API_ENDPOINT/verify-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       phoneNumber: countryCode + phoneNumber,
    //       otp: otpValue
    //     }),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     // Save token and navigate
    //     Alert.alert('Success', 'Login successful!');
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Invalid OTP');
    // } finally {
    //   setLoading(false);
    // }
  };

  // Resend OTP
  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    handleSendOTP();
  };

  // Edit phone number
  const handleEditPhone = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    clearInterval(timerRef.current);
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {isTrue ? <SuccessComponent /> : <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <Text style={styles.logo}>🔐</Text> */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'Enter your mobile number to continue'
              : 'Enter the verification code sent to your phone'}
          </Text>
        </View>

        {/* Phone Number Input */}
        {step === 'phone' && (
          <View style={styles.inputSection}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.countryCode}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                maxLength={4}
              />
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter mobile number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.button, !isValidPhone() && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={!isValidPhone() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* OTP Input */}
        {step === 'otp' && (
          <View style={styles.inputSection}>
            <View style={styles.otpHeader}>
              <Text style={styles.label}>Enter OTP</Text>
              <TouchableOpacity onPress={handleEditPhone}>
                <Text style={styles.editPhone}>
                  {countryCode} {phoneNumber}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (otpInputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoComplete="sms-otp"
                  textContentType="oneTimeCode"
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in {timer}s
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, otp.join('').length !== 6 && styles.buttonDisabled]}
              onPress={() => handleVerifyOTP()}
              disabled={otp.join('').length !== 6 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCode: {
    width: 70,
    height: 55,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    height: 55,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editPhone: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default MobileLoginScreen;