"use client";

import { useCookieConsent } from 'react-cookie-manager';

/**
 * useConsent – simple hook that returns `true` when the user has granted
 * analytics consent via react-cookie-manager (Cookiekit.io).
 *
 * This hook integrates with the CookieManager component and automatically
 * updates when consent state changes. It returns true if:
 * - User has accepted all cookies (hasConsent === true)
 * - User has specifically granted analytics consent (detailedConsent.analytics === true)
 */
export default function useConsent() {
  const { hasConsent, detailedConsent } = useCookieConsent();

  // Check if analytics consent is granted
  // hasConsent is true if user accepted all, false if declined, null if no choice made
  // For analytics, we check if user has general consent OR specifically granted analytics
  const consentGranted = hasConsent === true || 
    (detailedConsent?.Analytics?.consented === true);

  return consentGranted;
} 