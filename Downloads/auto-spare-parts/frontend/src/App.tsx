
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { useEffect } from "react";
import { useTheme } from "./hooks/use-theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetail from "./pages/CategoryDetail";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManagementPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import BannersPage from "./pages/admin/BannersPage";
import AdminLoginPage from "./pages/admin/LoginPage";
import CategoryPage from "./pages/admin/CategoryPage";
import BrandsPage from "./pages/admin/BrandsPage";
// Create a ThemeInitializer component to handle meta tag updates
const ThemeInitializer = () => {
  const { isMounted } = useTheme();
  
  useEffect(() => {
    if (!isMounted) return;
    
    // Add color-scheme meta tag if it doesn't exist
    if (!document.querySelector('meta[name="color-scheme"]')) {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = localStorage.getItem('theme') || 'light';
      document.head.appendChild(meta);
    }
  }, [isMounted]);
  
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if token exists
  const token = localStorage.getItem('token');
  
  // If no token, redirect to admin login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartProvider>
        <ThemeInitializer />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:slug" element={<CategoryDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><ProductsManagementPage /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/admin/banners" element={<ProtectedRoute><BannersPage /></ProtectedRoute>} />
              <Route path="/admin/brands" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><Navigate to="/admin" /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><Navigate to="/admin" /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><Navigate to="/admin" /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
