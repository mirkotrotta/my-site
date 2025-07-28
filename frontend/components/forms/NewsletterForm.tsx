// /frontend/components/forms/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import useTranslation from '@/hooks/useTranslation';
import Link from 'next/link';

interface NewsletterFormProps {
  language?: string; // Allow explicit language override from parent
}

export default function NewsletterForm({ language: parentLanguage }: NewsletterFormProps = {}) {
  const { t, language: hookLanguage } = useTranslation();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Use explicitly passed language first, fall back to the one from useTranslation()
  const language = parentLanguage || hookLanguage;

  // Get translation text with proper fallbacks
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return (translated && translated !== key) ? translated : fallback;
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setError(getText('newsletter.invalidEmail', 'Please enter a valid email address'));
      return;
    }

    if (!consent) {
      setStatus('error');
      setError(getText('newsletter.consentRequired', 'You must agree to the privacy policy to subscribe'));
      return;
    }
    
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch(`/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language, consent })
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Format error message for display
        const errorMsg = data.error && typeof data.error === 'string' 
          ? data.error
          : getText('newsletter.genericError', 'An error occurred. Please try again.');
          
        throw new Error(errorMsg);
      }

      setStatus('success');
      setEmail('');
      setConsent(false);
    } catch (err: unknown) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : getText('newsletter.genericError', 'An error occurred. Please try again.'));
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 mb-4">
      <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
        {getText('newsletter.title', 'Subscribe to updates')}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {getText('newsletter.subtitle', 'Get the latest articles delivered to your inbox')}
      </p>
      <form onSubmit={subscribe} className="space-y-3">
        <input
          type="email"
          required
          placeholder={getText('newsletter.emailPlaceholder', 'Your email address')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {getText('newsletter.consentText', 'I agree to receive newsletter updates and accept the')}{' '}
            <Link href={`/${language}/privacy`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {getText('newsletter.privacyPolicy', 'Privacy Policy')}
            </Link>
          </label>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2 px-3 font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {status === 'loading' 
            ? getText('newsletter.subscribing', 'Subscribing...') 
            : getText('newsletter.subscribe', 'Subscribe')}
        </button>
        {status === 'success' && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-2">
            {getText('newsletter.success', 'Thanks for subscribing!')}
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}