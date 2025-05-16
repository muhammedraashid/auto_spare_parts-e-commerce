
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X 
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '../theme/ThemeToggle';

const Header: React.FC = () => {
  const { t, dir } = useLanguage();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-auto-dark text-white sticky top-0 z-50">
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl md:text-2xl text-auto-red">
            {t('site.name')}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="hover:text-auto-red transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="hover:text-auto-red transition-colors">
              {t('nav.products')}
            </Link>
            <Link to="/categories" className="hover:text-auto-red transition-colors">
              {t('nav.categories')}
            </Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <ThemeToggle variant="ghost" />
            <LanguageSwitcher />
            <button onClick={toggleSearch} className="hover:text-auto-red transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="hover:text-auto-red transition-colors relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-auto-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="hover:text-auto-red transition-colors">
              <User size={20} />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
            <ThemeToggle variant="ghost" size="sm" />
            <LanguageSwitcher variant="ghost" />
            <button onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search bar (toggled) */}
      {isSearchOpen && (
        <div className="border-t border-gray-700 py-3 bg-auto-dark">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <Input 
                type="text" 
                placeholder={t('nav.search')} 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button variant="ghost" onClick={toggleSearch} className="ml-2 rtl:mr-2 rtl:ml-0">
                <X size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Navigation (toggled) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-auto-dark">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="py-2 hover:text-auto-red transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/products" className="py-2 hover:text-auto-red transition-colors">
                {t('nav.products')}
              </Link>
              <Link to="/categories" className="py-2 hover:text-auto-red transition-colors">
                {t('nav.categories')}
              </Link>
              <div className="border-t border-gray-700 pt-4 flex justify-between">
                <Link to="/cart" className="py-2 hover:text-auto-red transition-colors flex items-center">
                  <ShoppingCart size={18} className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.cart')}
                  {itemCount > 0 && (
                    <span className="ml-2 rtl:mr-2 bg-auto-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/login" className="py-2 hover:text-auto-red transition-colors flex items-center">
                  <User size={18} className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('nav.login')}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
