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
