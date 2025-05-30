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

const categoryFormSchema = z.object({
  nameEn: z.string().min(2, { message: 'English name is required' }),
  nameAr: z.string().min(2, { message: 'Arabic name is required' }),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  slug: z.string().min(1, { message: 'Slug is required' }),
  order: z.string().regex(/^\d+$/, { message: 'Order must be a number' }),
  parent: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  // Image handled separately
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: CategoryFormValues;
  onSubmit: (data: CategoryFormValues, image?: File | null) => void;
  isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading = false }: CategoryFormProps) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      slug: '',
      order: '',
      parent: null,
      isActive: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should not exceed 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader(); const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      slug: '',
      order: '',
      parent: null,
      isActive: true,
    },
  });

      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const internalSubmit = (data: CategoryFormValues) => {
    onSubmit(data, imageFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(internalSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* English */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">English Content</h3>

              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
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
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Arabic */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 text-right">المحتوى العربي</h3>

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right w-full block">الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم" {...field} dir="rtl" className="text-right" />
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
                      <Textarea placeholder="أدخل الوصف" {...field} dir="rtl" className="text-right" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Meta Fields */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{isRtl ? 'إعدادات التصنيف' : 'Category Settings'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'المعرف (Slug)' : 'Slug'}</FormLabel>
                    <FormControl>
                      <Input placeholder={isRtl ? 'أدخل المعرف' : 'Enter slug'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'الترتيب' : 'Order'}</FormLabel>
                    <FormControl>
                      <Input placeholder={isRtl ? 'أدخل الترتيب' : 'Enter order'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'التصنيف الرئيسي' : 'Parent Category (Optional)'}</FormLabel>
                    <FormControl>
                      <Input placeholder={isRtl ? 'اختياري' : 'Optional'} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{isRtl ? 'نشط' : 'Active'}</FormLabel>
                      <FormDescription>
                        {isRtl ? 'عرض التصنيف على الموقع' : 'Display category on site'}
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
            <h3 className="text-lg font-medium mb-4">{isRtl ? 'صورة التصنيف' : 'Category Image'}</h3>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-48">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {isRtl ? 'اسحب صورة أو انقر للتحميل' : 'Drag image or click to upload'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isRtl ? 'الحد الأقصى: 2 ميغابايت' : 'Max size: 2MB'}
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
            {isLoading ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التصنيف' : 'Save Category')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
