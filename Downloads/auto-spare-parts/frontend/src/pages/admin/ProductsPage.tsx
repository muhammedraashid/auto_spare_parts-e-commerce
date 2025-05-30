
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProductForm , ProductFormValues} from '@/components/admin/products/ProductForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/app/reduxHooks';
import { getProducts,createProduct,deleteProduct,updateProduct } from '@/features/products/productSlice';

export default function ProductsPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();
  const products = useAppSelector((state)=> state.products.products);
  const isLoaded = useAppSelector((state)=> state.categories.isLoaded);
  // const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(()=>{
    if (!isLoaded){
      dispatch(getProducts());
    }
  },[dispatch, isLoaded])

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(!showForm);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  const handleDeleteProduct = (id: number) => {
        const confirmDelete = isRtl
          ? window.confirm('هل أنت متأكد من حذف هذا القسم؟')
          : window.confirm('Are you sure you want to delete this category?');
  
        if (confirmDelete) {
          dispatch(deleteProduct(id));
        }
  };

const handleSubmitProduct = (data: ProductFormValues, image?: File | null) => {
  const formData = new FormData();

  const translations = {
    en: {
      name: data.nameEn || '',
      description: data.descriptionEn || '',
      specs: {},
      meta_title: '',
      meta_description: ''
    },
    ar: {
      name: data.nameAr || '',
      description: data.descriptionAr || '',
      specs: {},
      meta_title: '',
      meta_description: ''
    }
  };

  formData.append('translations', JSON.stringify(translations));
  formData.append('price', data.price?.toString() || '0');
  formData.append('compare_at_price', data.compareAtPrice?.toString() || '');
  formData.append('stock', data.stock?.toString() || '0');
  formData.append('sku', data.sku || '');
  if (data.brand) {
  formData.append('brand', data.brand.toString());
}

  formData.append('category', data.category ? String(data.category) : '');
  formData.append('is_featured', data.isFeatured ? 'true' : 'false');
  formData.append('is_active', data.isActive ? 'true' : 'false');

  if (image instanceof File) {
  formData.append('image', image);
  }


  formData.append('variants', JSON.stringify([]));
  formData.append('images', JSON.stringify([]));

  if (editingProduct) {
    dispatch(updateProduct({ id: editingProduct.id, data: formData }));
  } else {
    dispatch(createProduct(formData));
  }

  setShowForm(false);
};



  const filteredProducts = products.filter(product =>
  (product.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
  (product.name?.ar?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
  product.category.toString().includes(searchTerm)
);


  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isRtl ? 'إدارة المنتجات' : 'Product Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'أضف وعدّل وحذف المنتجات في متجرك' : 'Add, edit, and remove products in your store'}
          </p>
        </div>
        {showForm ? (
          <Button onClick={handleAddProduct}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isRtl ? 'عودة' : 'Back'}
          </Button>
        ) : (
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            {isRtl ? 'إضافة منتج' : 'Add Product'}
          </Button>
        )}

      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct 
                ? (isRtl ? 'تعديل المنتج' : 'Edit Product') 
                : (isRtl ? 'إضافة منتج جديد' : 'Add New Product')}
            </CardTitle>
            <CardDescription>
              {isRtl 
                ? 'أدخل تفاصيل المنتج بكلا اللغتين الإنجليزية والعربية' 
                : 'Enter product details in both English and Arabic'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm 
              initialData={editingProduct} 
              onSubmit={handleSubmitProduct} 
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
                placeholder={isRtl ? 'البحث عن منتج...' : 'Search products...'}
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card>
                <CardContent className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Product Image */}
                  <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={isRtl ? product.translations.ar.name : product.translations.en.name  ?? (isRtl ? 'بدون اسم' : 'Unnamed Product')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/160x160?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    {/* Product Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {isRtl ? product.translations.ar.name : product.translations.en.name  ?? (isRtl ? 'بدون اسم' : 'Unnamed Product')}
                      </h3>
                      <div className="flex gap-2">
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                            {isRtl ? 'مميز' : 'Featured'}
                          </span>
                        )}
                        {product.discountPercentage && product.discountPercentage > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                            -{product.discount_percentage}% {isRtl ? 'خصم' : 'OFF'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'العلامة التجارية:' : 'Brand:'}</span>
                        <p className="text-gray-600 mt-1">{product.brand_name}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'الفئة:' : 'Category:'}</span>
                        <p className="text-gray-600 mt-1">{product.category_name}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'رقم المنتج:' : 'Product ID:'}</span>
                        <p className="text-gray-600 mt-1">#{product.id}</p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'السعر:' : 'Price:'}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-lg font-semibold text-green-600">${product.price}</span>
                          {product.compareAtPrice && parseFloat(product.compare_at_price) > parseFloat(product.price) && (
                            <span className="line-through text-gray-400 text-sm">${product.compareAtPrice}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'المخزون:' : 'Stock:'}</span>
                        <p className={`mt-1 font-medium ${
                          product.stock > 10 ? 'text-green-600' :
                          product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.stock > 0
                            ? `${product.stock} ${isRtl ? 'متوفر' : 'available'}`
                            : (isRtl ? 'غير متوفر' : 'Out of Stock')}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'التقييم:' : 'Rating:'}</span>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-gray-500 text-xs">({product.reviewCount} {isRtl ? 'تقييم' : 'reviews'})</span>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'تاريخ الإضافة:' : 'Created:'}</span>
                        <p className="text-gray-600 mt-1">
                          {new Date(product.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">{isRtl ? 'الحالة:' : 'Status:'}</span>
                        <p className={`mt-1 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0
                            ? (isRtl ? 'متوفر' : 'In Stock')
                            : (isRtl ? 'غير متوفر' : 'Out of Stock')}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="font-medium text-gray-700 block mb-2">{isRtl ? 'الوصف:' : 'Description:'}</span>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {isRtl ? product.translations.ar.description : product.translations.en.description  ?? (isRtl ? 'لا يوجد وصف' : 'No description available')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="min-w-[80px]"
                  >
                    {isRtl ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="min-w-[80px]"
                  >
                    {isRtl ? 'حذف' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>

              ))
            ) : (
              <div className="text-center p-10 border rounded-lg">
                <p className="text-muted-foreground">
                  {isRtl ? 'لا توجد منتجات مطابقة لبحثك' : 'No products match your search'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
