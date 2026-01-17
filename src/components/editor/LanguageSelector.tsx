import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  restrictedLanguage?: string | null; // If set, only show this language (for track problems)
}

const SUPPORTED_LANGUAGES = [
  {
    value: 'python',
    label: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    value: 'java',
    label: 'Java',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
  },
  {
    value: 'cpp',
    label: 'C++',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'
  }
];

export function LanguageSelector({ value, onChange, disabled = false, restrictedLanguage }: LanguageSelectorProps) {
  // If restricted to a specific language (track problems), only show that language
  const availableLanguages = restrictedLanguage
    ? SUPPORTED_LANGUAGES.filter(l => l.value === restrictedLanguage)
    : SUPPORTED_LANGUAGES;

  const selectedLang = SUPPORTED_LANGUAGES.find(l => l.value === value);

  // If restricted, disable the selector
  const isDisabled = disabled || !!restrictedLanguage;

  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className="w-[160px] h-8 text-sm bg-muted border-border">
        <SelectValue>
          {selectedLang && (
            <span className="flex items-center gap-2">
              {selectedLang.icon.startsWith('http') ? (
                <img src={selectedLang.icon} alt={selectedLang.label} className="w-4 h-4 object-contain" />
              ) : (
                <span>{selectedLang.icon}</span>
              )}
              <span>{selectedLang.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <span className="flex items-center gap-2">
              {lang.icon.startsWith('http') ? (
                <img src={lang.icon} alt={lang.label} className="w-4 h-4 object-contain" />
              ) : (
                <span>{lang.icon}</span>
              )}
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}