
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs"
      >
        English
      </Button>
      <Button
        variant={language === 'kn' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('kn')}
        className="text-xs"
      >
        ಕನ್ನಡ
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
