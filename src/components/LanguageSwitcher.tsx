import { useLanguage } from '../context/LanguageContext';
import { Language } from '../data/translations';

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
];

interface LanguageSwitcherProps {
  /** light = cream pages (login/register), dark = purple marketing pages */
  variant?: 'dark' | 'light';
  align?: 'start' | 'center' | 'end';
}

export default function LanguageSwitcher({
  variant = 'dark',
  align = 'end',
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const alignClass =
    align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end';

  return (
    <div className={`flex items-center ${alignClass} gap-2 flex-nowrap`}>
      {languages.map((lang) => {
        const active = language === lang.code;
        const base =
          'relative z-10 shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap';
        const styles =
          variant === 'light'
            ? active
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-700'
            : active
              ? 'bg-amber-500 text-purple-950 border-amber-400 shadow-md shadow-amber-500/30'
              : 'bg-black/40 text-white/90 border-white/25 hover:bg-white/15 hover:text-white backdrop-blur-sm';

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`${base} ${styles}`}
          >
            {lang.name}
          </button>
        );
      })}
    </div>
  );
}
