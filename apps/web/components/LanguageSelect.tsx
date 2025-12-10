import { useI18n } from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const LanguageSelect = () => {
  const { setLocale, locale, t } = useI18n();

  return (
    <Select onValueChange={setLocale} value={locale}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">{t('select.english', 'English')}</SelectItem>
          <SelectItem value="uk">
            {t('select.ukrainian', 'Українська')}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
