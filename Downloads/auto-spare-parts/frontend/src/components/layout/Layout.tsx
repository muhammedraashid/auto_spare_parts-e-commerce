
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { dir, language } = useLanguage();
  const { theme, isMounted } = useTheme();

  // This ensures the theme class is applied to the root element
  useEffect(() => {
    if (!isMounted) return;
    
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('dark', 'light');
    
    // Add appropriate theme class
    root.classList.add(theme);
    
    // Add smooth scrolling behavior
    root.style.scrollBehavior = 'smooth';
    
    // Apply RTL specific CSS variables if needed
    if (language === 'ar') {
      document.body.style.setProperty('--flow-direction', 'rtl');
      document.body.style.setProperty('--start-direction', 'right');
      document.body.style.setProperty('--end-direction', 'left');
    } else {
      document.body.style.setProperty('--flow-direction', 'ltr');
      document.body.style.setProperty('--start-direction', 'left');
      document.body.style.setProperty('--end-direction', 'right');
    }
  }, [theme, language, isMounted]);

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300",
        language === 'ar' ? 'font-arabic' : 'font-sans',
        // Add a subtle fade-in animation when theme changes
        isMounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"
      )}
      dir={dir}
    >
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster position={language === 'ar' ? "bottom-left" : "bottom-right"} />
    </div>
  );
};

export default Layout;
