import { useEffect, useRef } from 'react';

function digitsOnly(raw: string, max = 6) {
  return String(raw || '')
    .replace(/\D/g, '')
    .slice(0, max);
}

/** Pull 4–6 digit OTP out of clipboard / SMS text */
function extractOtp(text: string): string {
  const t = String(text || '').trim();
  if (/^\d{4,8}$/.test(t)) return t.slice(0, 6);
  const m =
    t.match(/\b(\d{6})\b/) ||
    t.match(/\b(\d{4,5})\b/) ||
    t.match(/(\d{6})/);
  return m ? m[1].slice(0, 6) : '';
}

/**
 * Web OTP only (Android Chrome when SMS supports it).
 * Clipboard is NOT auto-read — old copied OTP was re-filling the field.
 * Use Paste button (readOtpFromClipboard) instead.
 */
export function useSmsOtpAutofill(
  enabled: boolean,
  onCode: (code: string) => void
) {
  const onCodeRef = useRef(onCode);
  onCodeRef.current = onCode;
  const filledOnceRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      filledOnceRef.current = false;
      return;
    }

    filledOnceRef.current = false;
    const ac = new AbortController();
    let cancelled = false;

    const apply = (raw: string) => {
      if (cancelled || filledOnceRef.current) return;
      const code = digitsOnly(raw);
      if (code.length < 4) return;
      filledOnceRef.current = true;
      onCodeRef.current(code);
    };

    const cred = (navigator as any).credentials;
    if (cred?.get) {
      cred
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp: { code?: string } | null) => {
          if (!cancelled && otp?.code) apply(otp.code);
        })
        .catch(() => undefined);
    }

    return () => {
      cancelled = true;
      ac.abort();
      filledOnceRef.current = false;
    };
  }, [enabled]);
}

/** Paste button only — does not run in background */
export async function readOtpFromClipboard(): Promise<string | null> {
  try {
    if (!navigator.clipboard?.readText) return null;
    const code = extractOtp(await navigator.clipboard.readText());
    return code.length >= 4 ? code : null;
  } catch {
    return null;
  }
}

export const otpInputProps = {
  type: 'text' as const,
  inputMode: 'numeric' as const,
  pattern: '[0-9]*',
  autoComplete: 'one-time-code' as const,
  name: 'otp',
  id: 'otp-input',
  autoCorrect: 'off' as const,
  autoCapitalize: 'off' as const,
  spellCheck: false,
  maxLength: 6,
  enterKeyHint: 'done' as const,
};
