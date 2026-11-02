// 2Factor OTP Service Integration

const TWOFACTOR_API_KEY = '36a45c11-c185-11f1-af74-0200cd936042';
const TWOFACTOR_BASE_URL = 'https://2factor.in/API/V1';
const TWOFACTOR_SMS_TEMPLATE = 'OTP1';

interface OTPResponse {
  Status: string;
  Details: string;
  Otp?: string; // Only in test mode
}

interface VerifyResponse {
  Status: string;
  Details: string;
}

// Send OTP to mobile number
export const sendOTP = async (mobile: string): Promise<OTPResponse> => {
  try {
    // Format mobile number (add 91 if not present)
    const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
    
    const url = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/${formattedMobile}/${TWOFACTOR_SMS_TEMPLATE}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data: OTPResponse = await response.json();
    
    if (data.Status === 'Success') {
      console.log('OTP sent successfully:', data.Details);
      // In test mode, OTP is returned in response
      if (data.Otp) {
        console.log('Test OTP:', data.Otp);
      }
      return data;
    } else {
      throw new Error(data.Details || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (mobile: string, otp: string): Promise<VerifyResponse> => {
  try {
    // Format mobile number
    const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
    
    const url = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/VERIFY3/${formattedMobile}/${otp}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data: VerifyResponse = await response.json();
    
    if (data.Status === 'Success') {
      console.log('OTP verified successfully');
      return data;
    } else {
      throw new Error(data.Details || 'Invalid OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Generate random OTP (for demo/testing)
export const generateDemoOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in localStorage (for demo purposes)
export const storeDemoOTP = (mobile: string, otp: string) => {
  localStorage.setItem(`otp_${mobile}`, otp);
  localStorage.setItem(`otp_time_${mobile}`, Date.now().toString());
};

// Verify demo OTP
export const verifyDemoOTP = (mobile: string, otp: string): boolean => {
  const storedOTP = localStorage.getItem(`otp_${mobile}`);
  const storedTime = localStorage.getItem(`otp_time_${mobile}`);
  
  if (!storedOTP || !storedTime) {
    return false;
  }
  
  // OTP expires after 5 minutes
  const now = Date.now();
  const otpTime = parseInt(storedTime);
  if (now - otpTime > 5 * 60 * 1000) {
    localStorage.removeItem(`otp_${mobile}`);
    localStorage.removeItem(`otp_time_${mobile}`);
    return false;
  }
  
  return storedOTP === otp;
};

// Clear stored OTP
export const clearDemoOTP = (mobile: string) => {
  localStorage.removeItem(`otp_${mobile}`);
  localStorage.removeItem(`otp_time_${mobile}`);
};
