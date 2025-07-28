import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removed
import { IBM_Plex_Sans } from "next/font/google"; // Keep this import
import "./globals.css";
import { Providers } from "@/components/providers";

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

// Get the correct base URL for metadata
const getMetadataBase = () => {
  if (process.env.NODE_ENV === 'development') {
    return new URL('http://localhost:4000');
  }
  return new URL('https://mirkotrotta.com');
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    template: '%s | Mirko Trotta'
  },
  description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Python', 'FastAPI', 'Docker', 'Full Stack Developer', 'Germany'],
  authors: [{ name: 'Mirko Trotta' }],
  creator: 'Mirko Trotta',
  publisher: 'Mirko Trotta',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    siteName: 'Mirko Trotta',
    title: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
    url: 'https://mirkotrotta.com',
    images: [
      {
        url: '/images/mirko-trotta-profile-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
    images: ['/images/mirko-trotta-profile-homepage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com',
    languages: {
      'en': 'https://mirkotrotta.com/en',
      'de': 'https://mirkotrotta.com/de',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSans.variable} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
