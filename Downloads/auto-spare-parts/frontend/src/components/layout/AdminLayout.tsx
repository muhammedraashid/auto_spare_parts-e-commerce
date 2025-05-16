
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, Package, Users, Settings, ChevronRight, Sun, Moon, ShoppingBag, CreditCard, ImageIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/services/authService';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/authService';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { dir, language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Fetch current user data - Fixed the useQuery implementation
  const { data: user, isLoading: loadingUser, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  // Handle errors separately after query execution
  useEffect(() => {
    if (error) {
      handleLogout();
    }
  }, [error]);

  useEffect(() => {
    // Check token on mount
    if (!localStorage.getItem('token')) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      logout();
      toast.success(t('auth.logoutSuccess'));
      setIsAuthenticated(false);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('auth.logoutError'));
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full" dir={dir}>
        <Sidebar className="border-r bg-sidebar">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-auto-red rounded-md flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <h2 className="text-lg font-semibold">{language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-between text-xs"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? 
                  <><Sun className="h-3 w-3 mr-2" /> {language === 'en' ? 'Light Mode' : 'الوضع النهاري'}</> : 
                  <><Moon className="h-3 w-3 mr-2" /> {language === 'en' ? 'Dark Mode' : 'الوضع الليلي'}</>
                }
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>{language === 'en' ? 'Management' : 'الإدارة'}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin">
                        <LayoutDashboard />
                        <span>{language === 'en' ? 'Dashboard' : 'لوحة التحكم'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/products') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/products">
                        <Package />
                        <span>{language === 'en' ? 'Products' : 'المنتجات'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/users') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/users">
                        <Users />
                        <span>{language === 'en' ? 'Users' : 'المستخدمون'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/orders') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/orders">
                        <ShoppingBag />
                        <span>{language === 'en' ? 'Orders' : 'الطلبات'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/payments') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/payments">
                        <CreditCard />
                        <span>{language === 'en' ? 'Payments' : 'المدفوعات'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/banners') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/banners">
                        <ImageIcon />
                        <span>{language === 'en' ? 'Banners' : 'البانرات'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/admin/settings') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                      <Link to="/admin/settings">
                        <Settings />
                        <span>{language === 'en' ? 'Settings' : 'الإعدادات'}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{loadingUser ? 'Loading...' : user?.name || 'Admin User'}</p>
                    <p className="text-xs text-muted-foreground">{loadingUser ? '...' : user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  title={language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
