
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for products, in real app this would come from API
const mockProducts = [
  {
    id: '1',
    nameEn: 'Brake Pads',
    nameAr: 'وسادات الفرامل',
    descriptionEn: 'High-quality brake pads for optimal braking performance',
    descriptionAr: 'وسادات فرامل عالية الجودة لأداء فرامل مثالي',
    price: '299.99',
    stock: '50',
    category: 'Brakes',
    image: '/placeholder.svg',
    isAvailable: true,
  },
  {
    id: '2',
    nameEn: 'Oil Filter',
    nameAr: 'فلتر زيت',
    descriptionEn: 'Premium oil filter for all vehicle types',
    descriptionAr: 'فلتر زيت ممتاز لجميع أنواع السيارات',
    price: '49.99',
    stock: '120',
    category: 'Filters',
    image: '/placeholder.svg',
    isAvailable: true,
  },
  {
    id: '3',
    nameEn: 'Spark Plugs Set',
    nameAr: 'مجموعة شمعات الإشعال',
    descriptionEn: 'Set of 4 high-performance spark plugs',
    descriptionAr: 'مجموعة من 4 شمعات إشعال عالية الأداء',
    price: '89.99',
    stock: '35',
    category: 'Engine',
    image: '/placeholder.svg',
    isAvailable: false,
  },
];

export default function ProductsPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleProductSubmit = (data: any) => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...data, id: editingProduct.id, image: editingProduct.image } : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct = {
        ...data,
        id: `${products.length + 1}`,
        image: '/placeholder.svg',
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameAr.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          {isRtl ? 'إضافة منتج' : 'Add Product'}
        </Button>
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
              onSubmit={handleProductSubmit} 
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
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-24 h-24 bg-muted">
                      <img
                        src={product.image}
                        alt={product.nameEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 flex flex-col md:flex-row justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${product.price}</p>
                            <p className={`text-sm ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                              {product.isAvailable 
                                ? (isRtl ? 'متوفر' : 'In Stock') 
                                : (isRtl ? 'غير متوفر' : 'Out of Stock')} ({product.stock})
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProduct(product)}
                        >
                          {isRtl ? 'تعديل' : 'Edit'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          {isRtl ? 'حذف' : 'Delete'}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
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
