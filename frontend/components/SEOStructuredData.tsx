import Script from 'next/script';

interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
}

interface WebPageStructuredDataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function PersonStructuredData({ name, jobTitle, description, url, image, sameAs }: PersonStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "url": url,
    "image": image,
    "sameAs": sameAs,
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "knowsAbout": [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Docker",
      "Web Development",
      "Full Stack Development"
    ]
  };

  return (
    <Script
      id="person-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebPageStructuredData({ title, description, url, image }: WebPageStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    ...(image && { "image": image }),
    "author": {
      "@type": "Person",
      "name": "Mirko Trotta"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mirko Trotta"
    }
  };

  return (
    <Script
      id="webpage-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mirko Trotta",
    "url": "https://mirkotrotta.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mirkotrotta.com/logo.png"
    },
    "sameAs": [
      "https://github.com/mirkotrotta",
      "https://linkedin.com/in/mirkotrotta"
    ]
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 