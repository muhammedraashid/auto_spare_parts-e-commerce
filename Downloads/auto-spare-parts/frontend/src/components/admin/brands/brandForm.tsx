import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

const brandFormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),

});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

interface BrandFormProps {
  initialData?: BrandFormValues;
  onSubmit: (data: BrandFormValues, logoFile?: File | null, logoThumbnailFile?: File | null) => void;
  isLoading?: boolean;
}

export function BrandForm({ initialData, onSubmit, isLoading = false }: BrandFormProps) {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const [logoThumbnailPreview, setLogoThumbnailPreview] = React.useState<string | null>(null);
  const [logoThumbnailFile, setLogoThumbnailFile] = React.useState<File | null>(null);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo size should not exceed 2MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo thumbnail size should not exceed 2MB');
        return;
      }
      setLogoThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const internalSubmit = (data: BrandFormValues) => {
    onSubmit(data, logoFile, logoThumbnailFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(internalSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          )}
        />

        {/* Logo Upload */}
        <Card>
          <CardContent>
            <FormLabel>Logo</FormLabel>
            <div className="mb-2">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="max-h-32 object-contain" />
              ) : (
                <p className="text-sm text-gray-500">Upload brand logo (max 2MB)</p>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
          </CardContent>
        </Card>

        {/* Logo Thumbnail Upload */}
        <Card>
          <CardContent>
            <FormLabel>Logo Thumbnail</FormLabel>
            <div className="mb-2">
              {logoThumbnailPreview ? (
                <img src={logoThumbnailPreview} alt="Logo Thumbnail Preview" className="max-h-20 object-contain" />
              ) : (
                <p className="text-sm text-gray-500">Upload logo thumbnail (max 2MB)</p>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleLogoThumbnailChange} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Brand'}
          </Button>
        </div>

      </form>
    </Form>
  );
}
