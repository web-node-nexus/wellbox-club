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
 * Best-effort OTP fill without changing SMS template:
 * 1) Web OTP (only if SMS has @domain #code — often missing)
 * 2) iOS keyboard suggestion via autocomplete="one-time-code"
 * 3) Clipboard: user copies OTP from SMS → returns to site → we paste
 *
 * Silent SMS inbox read is NOT allowed by browsers without special SMS format.
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
      const code = digitsOnly(raw);
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
        .catch(() => undefined);
    };

    const tryClipboard = async () => {
      try {
        if (!navigator.clipboard?.readText) return;
        const text = await navigator.clipboard.readText();
        const code = extractOtp(text);
        if (code) apply(code);
      } catch {
        /* no permission / empty — user can tap Paste */
      }
    };

    tryWebOtp();
    void tryClipboard();

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      tryWebOtp();
      void tryClipboard();
    };
    const onFocus = () => {
      void tryClipboard();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);

    // Poll clipboard lightly while OTP screen is open (Android often allows after copy)
    const poll = window.setInterval(() => {
      void tryClipboard();
    }, 2000);

    return () => {
      cancelled = true;
      ac.abort();
      window.clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [enabled]);
}

/** Call from a Paste button (user gesture → clipboard permission OK) */
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
  name: 'one-time-code',
  id: 'otp-input',
  autoCorrect: 'off' as const,
  autoCapitalize: 'characters' as const,
  spellCheck: false,
  maxLength: 6,
  enterKeyHint: 'done' as const,
};
