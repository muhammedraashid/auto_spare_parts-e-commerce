
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

const productFormSchema = z.object({
  nameEn: z.string().min(2, { message: "Product name must be at least 2 characters" }),
  nameAr: z.string().min(2, { message: "Arabic product name must be at least 2 characters" }),
  descriptionEn: z.string().min(10, { message: "Description must be at least 10 characters" }),
  descriptionAr: z.string().min(10, { message: "Arabic description must be at least 10 characters" }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid number" }),
  stock: z.string().regex(/^\d+$/, { message: "Stock must be a valid number" }),
  category: z.string().min(1, { message: "Category is required" }),
  isAvailable: z.boolean().default(true),
  // Image will be handled separately
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      price: '',
      stock: '',
      category: '',
      isAvailable: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should not exceed 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English Content */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">English Content</h3>
              
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Arabic Content */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 text-right">المحتوى العربي</h3>
              
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right w-full block">اسم المنتج</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم المنتج" {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-right w-full block">الوصف</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="أدخل وصف المنتج" 
                        className="min-h-[120px] text-right" 
                        {...field} 
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Product Details */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{isRtl ? 'تفاصيل المنتج' : 'Product Details'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'السعر' : 'Price'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder={isRtl ? 'أدخل السعر' : 'Enter price'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'المخزون' : 'Stock'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder={isRtl ? 'أدخل المخزون' : 'Enter stock quantity'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'التصنيف' : 'Category'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isRtl ? 'أدخل التصنيف' : 'Enter category'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {isRtl ? 'متاح للبيع' : 'Available for sale'}
                      </FormLabel>
                      <FormDescription>
                        {isRtl ? 'هذا المنتج سيظهر في الموقع' : 'This product will be displayed on the site'}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Image Upload */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{isRtl ? 'صورة المنتج' : 'Product Image'}</h3>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-48">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-contain" 
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {isRtl ? 'اسحب وأفلت أو انقر لتحميل صورة' : 'Drag and drop or click to upload an image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isRtl ? 'الحد الأقصى: 2 ميجابايت' : 'Max size: 2MB'}
                    </p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className={!imagePreview ? "" : "hidden"}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 
              (isRtl ? 'جاري الحفظ...' : 'Saving...') : 
              (isRtl ? 'حفظ المنتج' : 'Save Product')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
