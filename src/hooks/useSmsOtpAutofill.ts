import { useEffect, useRef } from 'react';

/**
 * Auto-fill OTP from SMS while this screen is open.
 *
 * iPhone (Safari/Chrome): shows OTP above keyboard — tap to fill
 *   (needs input autocomplete="one-time-code")
 *
 * Android Chrome: silent fill via Web OTP API — ONLY if SMS ends with:
 *   @your-domain.com #123456
 *   Example last line: @jewellbox.cloud #482913
 */
export function useSmsOtpAutofill(
  enabled: boolean,
  onCode: (code: string) => void
) {
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const apply = (raw: string) => {
      const code = String(raw || '')
        .replace(/\D/g, '')
        .slice(0, 6);
      if (code.length >= 4) onCodeRef.current(code);
    };

    const ac = new AbortController();
    let cancelled = false;

    const tryWebOtp = () => {
      const cred = (navigator as any).credentials;
      if (!cred?.get) return;

      cred
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp: { code?: string } | null) => {
          if (!cancelled && otp?.code) apply(otp.code);
        })
        .catch(() => {
          /* unsupported / timeout / user dismiss */
        });
    };

    tryWebOtp();

    // Re-arm when user returns to the tab (common after opening SMS app)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tryWebOtp();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      ac.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled]);
}

/** Props for OTP fields — required for iOS keyboard OTP suggestion */
export const otpInputProps = {
  type: 'text' as const,
  inputMode: 'numeric' as const,
  pattern: '[0-9]*',
  autoComplete: 'one-time-code' as const,
  name: 'one-time-code',
  id: 'otp-input',
  autoCorrect: 'off' as const,
  autoCapitalize: 'characters' as const,
  spellCheck: false,
  maxLength: 6,
  enterKeyHint: 'done' as const,
};
