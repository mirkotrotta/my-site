"use client";

import { ReactNode, useEffect } from 'react';
import useConsent from '@/hooks/useConsent';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

type AnalyticsProviderProps = {
  children: ReactNode;
  googleAnalyticsId?: string;
};

/**
 * AnalyticsProvider - A component that integrates Google Analytics 4 with consent management.
 * 
 * This component implements:
 * - Google Analytics 4 (GA4) with Google Consent Mode v2
 * - Consent-based script loading via react-cookie-manager
 * - Automatic pageview tracking for route changes
 * 
 * Usage:
 * ```tsx
 * <AnalyticsProvider googleAnalyticsId="G-XXXXXXXXXX">
 *   {children}
 * </AnalyticsProvider>
 * ```
 */
export default function AnalyticsProvider({
  children,
  googleAnalyticsId = "G-2M4MLECK0Q" // Default to your GA4 measurement ID
}: AnalyticsProviderProps) {
  // CMP-driven consent state
  const consentGranted = useConsent();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views when route changes
  useEffect(() => {
    if (!pathname || !consentGranted || !googleAnalyticsId) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Google Analytics pageview
    if (typeof window.gtag === 'function') {
      window.gtag('config', googleAnalyticsId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, googleAnalyticsId, consentGranted]);
  
  return (
    <>
      {/* Google Consent Mode v2 – default to denied BEFORE any other GA code */}
      {googleAnalyticsId && (
        <Script id="ga-consent-default" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('consent', 'default', { 'analytics_storage': 'denied' });
          `}
        </Script>
      )}

      {/* Google Analytics */}
      {googleAnalyticsId && consentGranted && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
              // Update consent to granted now that user has opted-in
              gtag('consent', 'update', { 'analytics_storage': 'granted' });
            `}
          </Script>
        </>
      )}
      

      
      {children}
    </>
  );
}

// Augment the window object to include Google Analytics gtag
declare global {
  interface Window {
    gtag: (command: string, targetId?: string, config?: Record<string, unknown>) => void;
  }
} 