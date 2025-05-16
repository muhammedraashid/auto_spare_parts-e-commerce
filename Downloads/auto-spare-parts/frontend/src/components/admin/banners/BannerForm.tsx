import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define the Banner type to ensure consistency
export interface Banner {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  ctaEn: string;
  ctaAr: string;
  image: string;
  url: string;
  active: boolean;
}

const bannerFormSchema = z.object({
  titleEn: z.string().min(2, { message: "Title must be at least 2 characters" }),
  titleAr: z.string().min(2, { message: "Arabic title must be at least 2 characters" }),
  descriptionEn: z.string(),
  descriptionAr: z.string(),
  ctaEn: z.string(),
  ctaAr: z.string(),
  url: z.string().url({ message: "Please enter a valid URL" }),
  active: z.boolean().default(true),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

interface BannerFormProps {
  initialData?: Banner;
  onSubmit: (data: BannerFormValues, imageFile: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BannerForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: BannerFormProps) {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData ? initialData.image : null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: initialData ? {
      titleEn: initialData.titleEn,
      titleAr: initialData.titleAr,
      descriptionEn: initialData.descriptionEn,
      descriptionAr: initialData.descriptionAr,
      ctaEn: initialData.ctaEn,
      ctaAr: initialData.ctaAr,
      url: initialData.url,
      active: initialData.active,
    } : {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      ctaEn: '',
      ctaAr: '',
      url: '',
      active: true,
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(isRtl ? 'يجب ألا يتجاوز حجم الصورة 2 ميجابايت' : 'Image size should not exceed 2MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: BannerFormValues) => {
    onSubmit(data, imageFile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData 
            ? (isRtl ? 'تعديل البانر' : 'Edit Banner') 
            : (isRtl ? 'إضافة بانر جديد' : 'Add New Banner')}
        </CardTitle>
        <CardDescription>
          {isRtl 
            ? 'أدخل تفاصيل البانر بكلا اللغتين الإنجليزية والعربية' 
            : 'Enter banner details in both English and Arabic'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{isRtl ? 'صورة البانر' : 'Banner Image'}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {isRtl 
                  ? 'يُفضل أن تكون أبعاد الصورة 1920×600 بكسل' 
                  : 'Recommended dimensions: 1920×600px'}
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-48">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imagePreview} 
                        alt="Banner preview" 
                        className="w-full h-full object-contain" 
                      />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">English Content</h3>
                
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter banner title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter banner description" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ctaEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call to Action Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Example: Shop Now" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Arabic Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right">المحتوى العربي</h3>
                
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right w-full block">عنوان البانر</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="أدخل عنوان البانر" 
                          className="text-right" 
                          dir="rtl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right w-full block">الوصف</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="أدخل وصف البانر" 
                          className="min-h-[80px] text-right" 
                          dir="rtl"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ctaAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right w-full block">نص دعوة للعمل</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="مثال: تسوق الآن" 
                          className="text-right" 
                          dir="rtl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Banner Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {isRtl ? 'إعدادات البانر' : 'Banner Settings'}
              </h3>
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isRtl ? 'رابط البانر' : 'Banner URL'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isRtl ? 'أدخل الرابط الذي سينتقل إليه المستخدم' : 'Enter URL where users will be directed'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {isRtl ? 'مثال: /products أو /categories/123' : 'Example: /products or /categories/123'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {isRtl ? 'نشط' : 'Active'}
                      </FormLabel>
                      <FormDescription>
                        {isRtl 
                          ? 'عند التفعيل، سيظهر هذا البانر على الموقع'
                          : 'When active, this banner will be displayed on the site'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isRtl ? 'جاري الحفظ...' : 'Saving...') 
                  : (isRtl ? 'حفظ البانر' : 'Save Banner')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
