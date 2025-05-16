
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'link' | 'ghost' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'ghost',
  size = 'sm'
}) => {
  const { t, language, setLanguage, dir } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      onClick={toggleLanguage}
      variant={variant}
      size={size}
      className={`flex items-center ${className}`}
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={16} className={dir === 'rtl' ? 'ml-1.5 mr-0' : 'mr-1.5'} />
      {t('language.switch')}
    </Button>
  );
};

export default LanguageSwitcher;
