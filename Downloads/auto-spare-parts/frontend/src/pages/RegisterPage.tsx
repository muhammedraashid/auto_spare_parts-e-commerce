
import React from 'react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle the registration logic
    console.log('Registration form submitted');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-auto-dark text-white text-center">
            <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">{t('auth.name')}</label>
              <Input 
                type="text" 
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">{t('auth.email')}</label>
              <Input 
                type="email" 
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">{t('auth.password')}</label>
              <Input 
                type="password" 
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">{t('auth.confirmPassword')}</label>
              <Input 
                type="password" 
                required
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-auto-red hover:bg-opacity-90"
            >
              {t('auth.register')}
            </Button>
            
            <div className="text-center text-sm">
              <span>{t('auth.hasAccount')} </span>
              <Link to="/login" className="text-auto-red font-medium">
                {t('auth.login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
