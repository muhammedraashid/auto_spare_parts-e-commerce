
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const NewsletterSection: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would send the data to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('newsletter.success'));
      form.reset();
    } catch (error) {
      toast.error(t('newsletter.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-auto-dark to-auto-dark/90">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-auto-red/20 rounded-full mb-4">
            <Mail className="h-6 w-6 text-auto-red" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('newsletter.title')}
          </h2>
          
          <p className="text-gray-300 mb-8">
            {t('newsletter.subtitle')}
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={t('newsletter.emailPlaceholder')} 
                          className={`h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                          dir={dir}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${language === 'ar' ? 'text-right' : 'text-left'} text-red-400`} />
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-auto-red hover:bg-auto-red/90 text-white h-12 px-6"
              >
                {isSubmitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
