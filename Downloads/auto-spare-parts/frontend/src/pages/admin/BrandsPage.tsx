import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { BrandForm, BrandFormValues } from '@/components/admin/brands/brandForm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import {
  getBrands,
  createBrand,
  deleteBrand,
  updateBrand,
} from '@/features/brands/brandSlice';

export default function BrandsPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const dispatch = useAppDispatch();
  const brands = useAppSelector((state) => state.brands.brands);
  const isLoaded = useAppSelector((state) => state.brands.isLoaded);

  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandFormValues & { id?: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoaded) {
      dispatch(getBrands());
    }
  }, [dispatch, isLoaded]);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setShowForm(!showForm);
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      isActive: brand.is_active,
    });
    setShowForm(true);
  };

  const handleDeleteBrand = (id: number) => {
    const confirmDelete = isRtl
      ? window.confirm('هل أنت متأكد من حذف هذه العلامة التجارية؟')
      : window.confirm('Are you sure you want to delete this brand?');
    if (confirmDelete) {
      dispatch(deleteBrand(id));
    }
  };

  const handleSubmitBrand = (
    data: BrandFormValues,
    logoFile?: File | null,
    logoThumbnailFile?: File | null
  ) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug || '');
    formData.append('description', data.description || '');
    formData.append('is_active', String(data.isActive));

    if (logoFile) formData.append('logo', logoFile);
    if (logoThumbnailFile) formData.append('logo_thumbnail', logoThumbnailFile);

    if (editingBrand?.id) {
      dispatch(updateBrand({ id: editingBrand.id, data: formData }));
    } else {
      dispatch(createBrand(formData));
    }

    setShowForm(false);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isRtl ? 'إدارة العلامات التجارية' : 'Brand Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'أضف وعدّل وحذف العلامات التجارية' : 'Add, edit, and delete brands'}
          </p>
        </div>
        <Button onClick={handleAddBrand}>
          {showForm ? (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isRtl ? 'عودة' : 'Back'}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {isRtl ? 'إضافة علامة تجارية' : 'Add Brand'}
            </>
          )}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBrand
                ? isRtl ? 'تعديل العلامة التجارية' : 'Edit Brand'
                : isRtl ? 'إضافة علامة تجارية جديدة' : 'Add New Brand'}
            </CardTitle>
            <CardDescription>
              {isRtl
                ? 'أدخل تفاصيل العلامة التجارية'
                : 'Enter brand details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrandForm
              initialData={editingBrand || undefined}
              onSubmit={handleSubmitBrand}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={isRtl ? 'البحث عن علامة تجارية...' : 'Search brands...'}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              {isRtl ? 'تصفية' : 'Filter'}
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <Card key={brand.id}>
                  <div className="flex items-center p-4 space-x-4">
                    <div className="w-16 h-16 bg-muted p-0.5 rounded overflow-hidden">
                      <img
                        src={brand.logo}
                        alt="Brand Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {brand.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBrand(brand)}
                      >
                        {isRtl ? 'تعديل' : 'Edit'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBrand(brand.id)}
                      >
                        {isRtl ? 'حذف' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-10 border rounded-lg">
                <p className="text-muted-foreground">
                  {isRtl ? 'لا توجد علامات تجارية مطابقة' : 'No brands found'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
