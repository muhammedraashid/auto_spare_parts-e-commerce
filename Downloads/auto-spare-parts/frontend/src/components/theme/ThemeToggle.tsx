
import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToggleProps } from "@radix-ui/react-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ThemeToggleProps extends Omit<ToggleProps, "defaultPressed" | "pressed" | "onPressedChange"> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "outline", size = "icon", className, ...props }) => {
  const { theme, setTheme, isMounted } = useTheme();
  const { dir, t } = useLanguage();
  
  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return <div className="w-10 h-10" />;
  }
  
  // Adjust the rotation direction based on RTL/LTR
  const rotationStyles = {
    sunHide: dir === 'rtl' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-0 rotate-90 scale-0',
    moonHide: dir === 'rtl' ? 'opacity-0 rotate-90 scale-0' : 'opacity-0 -rotate-90 scale-0',
    show: 'opacity-100 rotate-0 scale-100'
  };
  
  const isDark = theme === 'dark';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`relative transition-all duration-300 overflow-hidden rounded-full w-10 h-10 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' 
                : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
            } ${className}`}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            {...props}
            aria-label={isDark ? t('theme.toggleLight') : t('theme.toggleDark')}
          >
            <Sun 
              size={18} 
              className={`absolute transform transition-all duration-500 ${
                isDark ? rotationStyles.show : rotationStyles.sunHide
              } ${isDark ? 'text-yellow-300' : 'text-yellow-500'}`} 
            />
            <Moon 
              size={18} 
              className={`absolute transform transition-all duration-500 ${
                !isDark ? rotationStyles.show : rotationStyles.moonHide
              } ${!isDark ? 'text-slate-700' : 'text-slate-300'}`} 
            />
            
            {/* Enhanced glow effect */}
            <span className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
              isDark 
                ? 'bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 opacity-100' 
                : 'bg-gradient-to-tr from-yellow-300/30 via-amber-400/20 to-orange-400/10 opacity-100'
            }`} />
            
            {/* Subtle animated stars for dark mode */}
            {isDark && (
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute top-1 left-2 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" />
                <span className="absolute top-2 right-3 w-1 h-1 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
              </span>
            )}
            
            {/* Subtle animated rays for light mode */}
            {!isDark && (
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-px bg-yellow-400/50 animate-pulse" />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-yellow-400/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-px bg-yellow-400/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-px bg-yellow-400/50 animate-pulse" style={{ animationDelay: '0.7s' }} />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          align="center"
          className={`${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'} border-${isDark ? 'slate-700' : 'slate-200'}`}
        >
          {isDark ? t('theme.toggleLight') : t('theme.toggleDark')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
