import Script from 'next/script';

export interface BlogPostStructuredDataProps {
  post: {
    frontmatter: {
      title: string;
      date: string;
      summary?: string;
      tags?: string[];
      coverImage?: string;
    };
    slug: string;
    language?: string;
  };
  url: string;
}

export default function BlogPostStructuredData({ post, url }: BlogPostStructuredDataProps) {
  const { frontmatter, slug, language = 'en' } = post;
  const publishDate = new Date(frontmatter.date).toISOString();
  
  // Generate the cover image URL, or fallback to a placeholder
  const coverImage = frontmatter.coverImage || `https://picsum.photos/seed/${slug}/1200/600`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": frontmatter.title,
    "description": frontmatter.summary || `${frontmatter.title} - Blog Post`,
    "author": {
      "@type": "Person",
      "name": "Mirko Trotta",
      "url": "https://mirkotrotta.com",
      "sameAs": [
        "https://github.com/mirkotrotta",
        "https://linkedin.com/in/mirkotrotta"
      ]
    },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "publisher": {
      "@type": "Organization",
      "name": "Mirko Trotta",
      "url": "https://mirkotrotta.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mirkotrotta.com/images/logo-transparent-mirko%20trotta-metacubostudio-germany-deutschland.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "image": {
      "@type": "ImageObject",
      "url": coverImage,
      "width": 1200,
      "height": 600
    },
    "keywords": frontmatter.tags?.join(", ") || "",
    "articleSection": "Blog",
    "inLanguage": language,
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "Blog",
      "name": "Mirko Trotta's Blog",
      "url": `/${language}/blog`
    }
  };

  return (
    <Script
      id={`blogpost-structured-data-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 