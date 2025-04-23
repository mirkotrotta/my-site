// /frontend/components/forms/NewsletterForm.tsx
'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setError('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Format error message for display
        const errorMsg = data.error && typeof data.error === 'string' 
          ? data.error
          : 'Subscription failed. Please try again later.';
          
        throw new Error(errorMsg);
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-50/50 dark:bg-gray-800 mb-6">
      <h4 className="text-lg font-normal text-gray-900 dark:text-gray-100 mb-2">Subscribe to System Logs Newsletter</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">No spam. Just useful updates.</p>
      <form onSubmit={subscribe} className="space-y-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border-b bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100/20 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-2"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-2 font-normal text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {status === 'success' && (
          <p className="text-green-600 text-sm">🎉 Subscribed!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}