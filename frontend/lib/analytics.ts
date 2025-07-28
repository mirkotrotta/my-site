import { consentManager } from './consentManager';

// Analytics event tracking helpers
export const analytics = {
  // Track page views
  pageView: (url: string) => {
    const consent = consentManager.getConsent();
    if (!consent?.analytics || typeof window.gtag !== 'function') return;
    
    window.gtag('config', 'G-2M4MLECK0Q', {
      page_path: url,
    });
  },

  // Track custom events
  event: (action: string, parameters?: Record<string, unknown>) => {
    const consent = consentManager.getConsent();
    if (!consent?.analytics || typeof window.gtag !== 'function') return;
    
    window.gtag('event', action, parameters);
  },

  // Track button clicks
  trackClick: (buttonName: string, location?: string) => {
    analytics.event('click', {
      event_category: 'engagement',
      event_label: buttonName,
      page_location: location || window.location.pathname,
    });
  },

  // Track form submissions
  trackFormSubmit: (formName: string, success: boolean = true) => {
    analytics.event('form_submit', {
      event_category: 'form',
      event_label: formName,
      success: success,
    });
  },

  // Track downloads
  trackDownload: (fileName: string, fileType?: string) => {
    analytics.event('file_download', {
      event_category: 'download',
      event_label: fileName,
      file_extension: fileType,
    });
  },

  // Track outbound links
  trackOutboundLink: (url: string, linkText?: string) => {
    analytics.event('click', {
      event_category: 'outbound_link',
      event_label: linkText || url,
      outbound: true,
    });
  },
}; 