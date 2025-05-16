
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Banner, BannerForm, BannerFormValues } from '@/components/admin/banners/BannerForm';
import { BannerList } from '@/components/admin/banners/BannerList';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '@/services/bannerService';

export default function BannersPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });

  // Create banner mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: isRtl ? 'تم إنشاء البانر بنجاح' : 'Banner created successfully',
      });
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: isRtl ? 'خطأ' : 'Error',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  // Update banner mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: isRtl ? 'تم تحديث البانر بنجاح' : 'Banner updated successfully',
      });
      setShowForm(false);
      setEditingBanner(null);
    },
    onError: (error) => {
      toast({
        title: isRtl ? 'خطأ' : 'Error',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  // Delete banner mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: isRtl ? 'تم حذف البانر بنجاح' : 'Banner deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: isRtl ? 'خطأ' : 'Error',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  const handleAddBanner = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleFormSubmit = (data: BannerFormValues, imageFile: File | null) => {
    // Create a FormData object to handle file upload
    const formData = new FormData();
    
    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    
    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (editingBanner) {
      // Update existing banner
      updateMutation.mutate({ id: editingBanner.id, data: formData });
    } else {
      // Create new banner
      createMutation.mutate(formData);
    }
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا البانر؟' : 'Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleBanner = (id: string) => {
    // Find the banner to toggle
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    
    // Create FormData for the update
    const formData = new FormData();
    formData.append('active', String(!banner.active));
    
    // Update the banner
    updateMutation.mutate({ id, data: formData });
  };

  const handleMoveBanner = (id: string, direction: 'up' | 'down') => {
    // This would require a specific endpoint in your API
    // For now, just invalidate the query to refresh the list
    toast({
      title: isRtl ? 'جاري تنفيذ الطلب...' : 'Processing request...',
    });
    
    // Here you would call an API endpoint to reorder banners
    // Then invalidate the query:
    // queryClient.invalidateQueries({ queryKey: ['banners'] });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isRtl ? 'إدارة البانرات' : 'Banner Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'إنشاء وتعديل بانرات الصفحة الرئيسية' : 'Create and manage homepage banners'}
          </p>
        </div>
        <Button onClick={handleAddBanner} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          {isRtl ? 'إضافة بانر' : 'Add Banner'}
        </Button>
      </div>

      {showForm ? (
        <BannerForm 
          initialData={editingBanner || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      ) : (
        <BannerList
          banners={banners}
          onEdit={handleEditBanner}
          onDelete={handleDeleteBanner}
          onToggle={handleToggleBanner}
          onMove={handleMoveBanner}
          isLoading={isLoading}
        />
      )}
    </AdminLayout>
  );
}
