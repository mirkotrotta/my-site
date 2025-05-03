import { useState } from 'react';
import { z } from 'zod';
import Button from './Button';
import useTranslation from '@/hooks/useTranslation';

// Define the form validation schema with Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const validateField = (name: keyof FormData, value: string) => {
    try {
      formSchema.shape[name].parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
        return false;
      }
      return false;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (submitStatus !== 'idle') {
      validateField(name as keyof FormData, value);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    let isValid = true;
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      try {
        formSchema.shape[key].parse(formData[key]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          isValid = false;
          newErrors[key] = error.errors[0].message;
        }
      }
    });
    
    setErrors(newErrors);
    
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // This would be replaced with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('contact.getInTouch')}
      </h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          {t('contact.messageSent')}
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          {t('contact.errorSending')}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-1">
            {t('contact.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('contact.namePlaceholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-1">
            {t('contact.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('contact.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('contact.messagePlaceholder')}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('contact.sending') : t('contact.send')}
        </Button>
      </form>
    </div>
  );
} 