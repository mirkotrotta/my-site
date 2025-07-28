"use client";

import dynamic from "next/dynamic";
import { ReactNode, Suspense } from "react";
import useTranslation from "@/hooks/useTranslation";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";

// Dynamically import the CookieManager to prevent SSR issues
const CookieManagerWithNoSSR = dynamic(
  () => import("react-cookie-manager").then((mod) => mod.CookieManager),
  { ssr: false, loading: () => null }
);

// REQUIRED: Import the CSS for proper modal functionality
import "react-cookie-manager/style.css";
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang || 'en';

  const cookieBannerTranslations = {
    title: t('cookieBanner.title'),
    message: t('cookieBanner.message'),
    buttonText: t('cookieBanner.buttonText'),
    declineButtonText: t('cookieBanner.declineButtonText'),
    manageButtonText: t('cookieBanner.manageButtonText'),
    privacyPolicyText: t('cookieBanner.privacyPolicyText'),
    manageTitle: t('cookieBanner.manageTitle'),
    manageMessage: t('cookieBanner.manageMessage'),
    manageEssentialTitle: t('cookieBanner.manageEssentialTitle'),
    manageEssentialSubtitle: t('cookieBanner.manageEssentialSubtitle'),
    manageAnalyticsTitle: t('cookieBanner.manageAnalyticsTitle'),
    manageAnalyticsSubtitle: t('cookieBanner.manageAnalyticsSubtitle'),
    manageSocialTitle: t('cookieBanner.manageSocialTitle'),
    manageSocialSubtitle: t('cookieBanner.manageSocialSubtitle'),
    manageAdvertTitle: t('cookieBanner.manageAdvertTitle'),
    manageAdvertSubtitle: t('cookieBanner.manageAdvertSubtitle'),
    manageCancelButtonText: t('cookieBanner.manageCancelButtonText'),
    manageSaveButtonText: t('cookieBanner.manageSaveButtonText'),
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .dark [data-cookie-manager-modal-title] {
            color: #ffffff !important;
          }
          
          /* Style the floating button */
          .cookie-manager-floating-button {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 9999 !important;
            background: #3b82f6 !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.2s ease !important;
          }
          
          .cookie-manager-floating-button:hover {
            background: #2563eb !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
          }
          
          .dark .cookie-manager-floating-button {
            background: #1d4ed8 !important;
          }
          
          .dark .cookie-manager-floating-button:hover {
            background: #1e40af !important;
          }
        `
      }} />
      <CookieManagerWithNoSSR
        cookieKitId={process.env.NEXT_PUBLIC_COOKIEKIT_SITE_ID || "687e637efdf1be96c8f56417"}
        translations={cookieBannerTranslations}
        privacyPolicyUrl={`/${lang}/privacy`}
        theme={theme === 'dark' ? 'dark' : 'light'}
        displayType="popup"
        enableFloatingButton={true}
        showManageButton={true}
        classNames={{
          popupContainer: "fixed bottom-5 right-5 z-[9999] w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-4 space-y-4",
          popupTitle: "text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1",
          popupMessage: "text-sm text-gray-700 dark:text-gray-300 leading-relaxed",
          acceptButton: "w-full inline-flex items-center justify-center text-base px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !bg-blue-600 !text-white font-medium hover:!bg-blue-700",
          declineButton: "w-full inline-flex items-center justify-center text-base px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 !bg-gray-800 !text-white font-medium hover:!bg-gray-900",
          manageButton: "w-full inline-flex items-center justify-center text-base px-5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !border !border-blue-600 !text-blue-600 font-medium hover:!bg-blue-600 hover:!text-white dark:hover:!bg-blue-600 dark:hover:!text-white",
          privacyPolicyLink: "text-sm text-blue-600 hover:underline dark:text-blue-400",
          manageCookieTitle: "!text-gray-900 dark:!text-gray-800 font-semibold",
          manageCookieMessage: "text-gray-700 dark:text-gray-300",
          manageCookieCategoryTitle: "text-gray-900 dark:text-gray-800",
          manageCookieCategorySubtitle: "text-gray-600 dark:text-gray-400",
          manageCookieStatusText: "text-gray-500 dark:text-gray-400",
          manageCancelButton: "inline-flex items-center justify-center text-sm px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 !bg-gray-800 !text-white font-medium hover:!bg-gray-900",
          manageSaveButton: "inline-flex items-center justify-center text-sm px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 !bg-blue-600 !text-white font-medium hover:!bg-blue-700",
        }}                  
      >
        <Suspense fallback={null}>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </Suspense>
      </CookieManagerWithNoSSR>
    </>
  );
} 