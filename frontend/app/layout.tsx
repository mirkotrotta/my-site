import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    default: 'Mirko Trotta | Full Stack Developer & Product Manager',
    template: '%s | Mirko Trotta'
  },
  description: 'Personal website built with Next.js and Tailwind CSS',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  authors: [{ name: 'Anonymous' }],
  creator: 'Anonymous',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AnalyticsProvider
          // Add your analytics IDs here - these are just examples
          // googleAnalyticsId="G-XXXXXXXXXX"
          // fathomSiteId="XXXXXXXXXX"
          // plausibleDomain="yourdomain.com"
          // umamiWebsiteId="XXXXXXXXXX"
        >
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
