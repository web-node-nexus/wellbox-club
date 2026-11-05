// 2Factor OTP Service — AUTOGEN + VERIFY3
// Send:  GET /API/V1/{KEY}/SMS/{mobile}/AUTOGEN/{TEMPLATE}
// Verify: GET /API/V1/{KEY}/SMS/VERIFY3/{91mobile}/{otp}

const TWOFACTOR_API_KEY =
  import.meta.env.VITE_TWOFACTOR_API_KEY || '36a45c11-c185-11f1-af74-0200cd936042';
const TWOFACTOR_SMS_TEMPLATE =
  import.meta.env.VITE_TWOFACTOR_SMS_TEMPLATE || 'OTP1';
const TWOFACTOR_BASE_URL =
  import.meta.env.VITE_TWOFACTOR_BASE_URL || 'https://2factor.in/API/V1';

/** Fixed admin login — OTP hardcoded, not sent via SMS. Members/leaders unaffected. */
export const ADMIN_MOBILE = '9999999999';
export const ADMIN_OTP = '000000';

// Dev proxy avoids browser CORS; production hits 2factor directly
const API_ROOT =
  import.meta.env.DEV
    ? `/api/2factor/${TWOFACTOR_API_KEY}`
    : `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}`;

interface OTPResponse {
  Status: string;
  Details: string;
  Otp?: string;
}

interface VerifyResponse {
  Status: string;
  Details: string;
}

const to10Digit = (mobile: string) => mobile.replace(/\D/g, '').slice(-10);
const to91 = (mobile: string) => `91${to10Digit(mobile)}`;

export const isAdminMobile = (mobile: string) => to10Digit(mobile) === ADMIN_MOBILE;

/** Offline/admin bootstrap when Supabase is unreachable on production */
export const ADMIN_FALLBACK_USER = {
  id: '1',
  name: 'Admin User',
  mobile: ADMIN_MOBILE,
  email: 'admin@jwellbox.com',
  phone: `+91 ${ADMIN_MOBILE}`,
  referralCode: 'ADMIN001',
  referredBy: '',
  city: '',
  role: 'admin' as const,
  isLeader: true,
  teamSize: 0,
  joinDate: '2023-01-01',
};

export const sendOTP = async (mobile: string): Promise<OTPResponse> => {
  const phone = to10Digit(mobile);

  // Admin: skip SMS — OTP is always ADMIN_OTP
  if (phone === ADMIN_MOBILE) {
    return { Status: 'Success', Details: 'Admin fixed OTP', Otp: ADMIN_OTP };
  }

  const url = `${API_ROOT}/SMS/${phone}/AUTOGEN/${TWOFACTOR_SMS_TEMPLATE}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data: OTPResponse = await response.json();

  if (data.Status === 'Success') {
    if (data.Details) {
      sessionStorage.setItem(`otp_session_${phone}`, data.Details);
    }
    return data;
  }

  throw new Error(data.Details || 'Failed to send OTP');
};

export const verifyOTP = async (mobile: string, otp: string): Promise<VerifyResponse> => {
  const phone = to10Digit(mobile);

  // Admin only: accept hardcoded OTP
  if (phone === ADMIN_MOBILE) {
    if (otp === ADMIN_OTP) {
      return { Status: 'Success', Details: 'Admin OTP verified' };
    }
    throw new Error('Invalid OTP');
  }

  const phone91 = to91(mobile);
  const url = `${API_ROOT}/SMS/VERIFY3/${phone91}/${otp}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data: VerifyResponse = await response.json();

  if (data.Status === 'Success') {
    return data;
  }

  throw new Error(data.Details || 'Invalid OTP');
};

/** Demo fallback only when 2Factor API is unreachable */
export const generateDemoOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const storeDemoOTP = (mobile: string, otp: string) => {
  const phone = to10Digit(mobile);
  localStorage.setItem(`otp_${phone}`, otp);
  localStorage.setItem(`otp_time_${phone}`, Date.now().toString());
};

export const verifyDemoOTP = (mobile: string, otp: string): boolean => {
  const phone = to10Digit(mobile);

  // Admin fixed OTP (also works if Login falls into demo path)
  if (phone === ADMIN_MOBILE) return otp === ADMIN_OTP;

  const storedOTP = localStorage.getItem(`otp_${phone}`);
  const storedTime = localStorage.getItem(`otp_time_${phone}`);

  if (!storedOTP || !storedTime) return false;

  if (Date.now() - parseInt(storedTime, 10) > 5 * 60 * 1000) {
    clearDemoOTP(phone);
    return false;
  }

  return storedOTP === otp;
};

export const clearDemoOTP = (mobile: string) => {
  const phone = to10Digit(mobile);
  localStorage.removeItem(`otp_${phone}`);
  localStorage.removeItem(`otp_time_${phone}`);
  sessionStorage.removeItem(`otp_session_${phone}`);
};
