'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define the form input types
type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
  _gotcha: string; // Honeypot field
  privacy: boolean;
};

export default function ContactForm() {
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormInputs>();

  // Formspree endpoint - uses environment variable or fallback
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/your-form-id';

  // Handle form submission
  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    // Check if honeypot field is filled (bot submission)
    if (data._gotcha) {
      // Silently reject bot submissions
      console.log('Bot submission detected');
      setIsSubmitSuccessful(true); // Pretend it was successful
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status}`);
      }

      setIsSubmitSuccessful(true);
      reset(); // Clear the form
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to submit the form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Success message */}
      {isSubmitSuccessful ? (
        <div className="p-4 mb-4 text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30">
          <h3 className="text-lg font-normal">Message sent!</h3>
          <p>Thank you for your message. I'll get back to you soon.</p>
          <button 
            onClick={() => setIsSubmitSuccessful(false)}
            className="mt-2 px-4 py-2 text-sm font-normal text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Honeypot field */}
          <input
            type="text"
            name="_gotcha"
            id="_gotcha"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            aria-label="Please leave this field empty"
          />
          
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-3 py-2 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100/20 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-2 ${
                errors.name ? 'border-red-500 dark:border-red-700' : ''
              }`}
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
          
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100/20 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-2 ${
                errors.email ? 'border-red-500 dark:border-red-700' : ''
              }`}
              placeholder="your.email@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          {/* Message field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className={`w-full px-3 py-2 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100/20 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-2 ${
                errors.message ? 'border-red-500 dark:border-red-700' : ''
              }`}
              placeholder="Your message here..."
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
            )}
          </div>
          
          {/* Privacy consent */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 bg-white dark:bg-gray-800"
                {...register('privacy', { required: 'Please agree to the privacy policy' })}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="privacy" className="font-medium text-gray-700 dark:text-gray-300">
                I agree to the processing of my data
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Your information is only used to respond to your message.
              </p>
              {errors.privacy && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.privacy?.message}</p>
              )}
            </div>
          </div>
          
          {/* Error message */}
          {submitError && (
            <div className="p-3 text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 rounded-md">
              <p>{submitError}</p>
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-normal text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
