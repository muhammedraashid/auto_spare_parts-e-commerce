import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { CategoryForm , CategoryFormValues} from '@/components/admin/categories/CategoryForm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { fetchCategories} from '@/services/categoryService';
import { getBase } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { getCategories, updateCategory, deleteCategory, createCategory} from '@/features/categories/categorySlice';

import { number } from 'zod';
  // You must create this component

export default function CategoryPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
//   const [categories, setCategories] = useState([]);
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state)=> state.categories.categories);
  const isLoaded = useAppSelector((state)=> state.categories.isLoaded);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
     if(!isLoaded){
        dispatch(getCategories());
     }
    }, [dispatch, isLoaded]);
  
  

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(!showForm);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

    const handleDeleteCategory = (id: number) => {
      const confirmDelete = isRtl
        ? window.confirm('هل أنت متأكد من حذف هذا القسم؟')
        : window.confirm('Are you sure you want to delete this category?');

      if (confirmDelete) {
        dispatch(deleteCategory(id));
      }
    };

  const handleSubmitCategory = (data: CategoryFormValues, image?: File | null) => {
  const formData = new FormData();

 
  const translations = {
    en: {
      name: data.nameEn || '',
      description: data.descriptionEn || '',
    },
    ar: {
      name: data.nameAr || '',
      description: data.descriptionAr || '',
    },
  };


  formData.append('translations', JSON.stringify(translations));

  formData.append('slug', data.slug || '');
  formData.append('parent', data.parent || '');  
  formData.append('is_active', data.isActive !== undefined ? String(data.isActive) : 'false');
  formData.append('order', data.order !== undefined ? String(data.order) : '0');


  if (image) {
    formData.append('image', image);
  }

  
  if (editingCategory) {
    dispatch(updateCategory({ id: editingCategory.id, data: formData }));
  } else {
    dispatch(createCategory(formData));
  }

  setShowForm(false);
};




  const filteredCategories = categories.filter(c =>
    c.translations?.en?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    c.translations?.ar?.name?.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isRtl ? 'إدارة الأقسام' : 'Category Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'أضف وعدّل وحذف الأقسام' : 'Add, edit, and delete categories'}
          </p>
        </div>
        {showForm ? (
            <Button onClick={handleAddCategory}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isRtl ? 'عودة' : 'Back'}
            </Button>
          ) : (
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              {isRtl ? 'إضافة قسم' : 'Add Category'}
            </Button>
          )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory
                ? isRtl ? 'تعديل القسم' : 'Edit Category'
                : isRtl ? 'إضافة قسم جديد' : 'Add New Category'}
            </CardTitle>
            <CardDescription>
              {isRtl
                ? 'أدخل تفاصيل القسم بكلتا اللغتين'
                : 'Enter category details in both English and Arabic'}
            </CardDescription>
          </CardHeader>
          <CardContent>
        <CategoryForm
              initialData={editingCategory}
              onSubmit={handleSubmitCategory}
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
                placeholder={isRtl ? 'البحث عن قسم...' : 'Search categories...'}
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
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <Card key={category.id}>
                  <div className="flex items-center p-4 space-x-4">
                    <div className="w-16 h-16 bg-muted p-0.5 rounded overflow-hidden">
                      <img
                        src={category.image}
                        alt="Category"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {isRtl
                          ? category.translations.ar.name
                          : category.translations.en.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        {isRtl ? 'تعديل' : 'Edit'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
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
                  {isRtl ? 'لا توجد أقسام مطابقة' : 'No categories found'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
