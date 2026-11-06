import { useEffect, useRef } from 'react';

/**
 * Auto-fill OTP from SMS when the page is open on the phone.
 * - iOS Safari / Chrome: needs input autocomplete="one-time-code"
 * - Android Chrome: Web OTP API (SMS should include @yourdomain #CODE)
 */
export function useSmsOtpAutofill(
  enabled: boolean,
  onCode: (code: string) => void
) {
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;

  useEffect(() => {
    if (!enabled) return;

    const ac = new AbortController();
    const otpCredentials = (navigator as any).credentials;
    if (!otpCredentials?.get) return;

    otpCredentials
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      })
      .then((otp: { code?: string } | null) => {
        const code = String(otp?.code || '')
          .replace(/\D/g, '')
          .slice(0, 6);
        if (code.length >= 4) onCodeRef.current(code);
      })
      .catch(() => {
        /* dismissed / unsupported / aborted */
      });

    return () => ac.abort();
  }, [enabled]);
}

/** Shared props for OTP text fields (iOS suggestion + numeric keyboard) */
export const otpInputProps = {
  type: 'text' as const,
  inputMode: 'numeric' as const,
  pattern: '[0-9]*',
  autoComplete: 'one-time-code' as const,
  name: 'one-time-code',
  autoCorrect: 'off' as const,
  autoCapitalize: 'off' as const,
  spellCheck: false,
  maxLength: 6,
};
