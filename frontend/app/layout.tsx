import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed
import { IBM_Plex_Sans } from "next/font/google"; // Keep this import
import "./globals.css";
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import Script from 'next/script';
// Removed ThemeProvider, Header, Footer imports

// const geistSans = Geist({ // Removed
//   variable: "--font-geist-sans",
//   display: "swap",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({ // Removed
//   variable: "--font-geist-mono",
//   display: "swap",
//   subsets: ["latin"],
// });

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// A safer approach - just use absolute URL objects for better compatibility
export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:4000'),
  title: {
    default: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    template: '%s | Mirko Trotta'
  },
  description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  authors: [{ name: 'Mirko Trotta' }],
  creator: 'Mirko Trotta',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable}`} suppressHydrationWarning>
      {/* Body tag gets theme classes applied dynamically by components/Layout.tsx */}
      <body> 
        {/* Removed ThemeProvider wrapper */}
        {/* Removed Header and Footer components */}
        {children} {/* Render children directly */}
        
        {/* Analytics Script */}
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="lazyOnload"
          />
        )}
        {/* Optional: Other Analytics Providers */}
        {/* <AnalyticsProvider /> */}
      </body>
    </html>
  );
}
