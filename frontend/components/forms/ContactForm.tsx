'use client';

import React, { useState } from 'react';
import useTranslation from '@/hooks/useTranslation';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('contact.errors.nameRequired');
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('contact.errors.nameLength');
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('contact.errors.emailRequired');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('contact.errors.emailInvalid');
        isValid = false;
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.errors.subjectRequired');
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('contact.errors.messageRequired');
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.errors.messageLength');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      // API call to send form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('contact.errors.general'));
      }
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setSubmitStatus('success');
      setStatusMessage(t('contact.success'));
      
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setStatusMessage(error.message || t('contact.errors.general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="p-0"
      >
       {/* <h2 className="text-2xl font-normal mb-6 text-gray-800 dark:text-white">
          {t('contact.title')}
        </h2> */}
        
        {/* Name field */}
        <div className="mb-6">
          <label 
            htmlFor="name"
            className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300"
          >
            {t('contact.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* Email field */}
        <div className="mb-6">
          <label 
            htmlFor="email"
            className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300"
          >
            {t('contact.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Subject field */}
        <div className="mb-6">
          <label 
            htmlFor="subject"
            className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300"
          >
            {t('contact.subject')}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>
        
        {/* Message field */}
        <div className="mb-6">
          <label 
            htmlFor="message"
            className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300"
          >
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        {/* Submit button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200"
          >
            {isSubmitting ? t('contact.sending') : t('contact.send')}
          </button>
          
          {submitStatus === 'success' && (
            <p className="text-green-600">{statusMessage}</p>
          )}
          
          {submitStatus === 'error' && (
            <p className="text-red-600">{statusMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}
