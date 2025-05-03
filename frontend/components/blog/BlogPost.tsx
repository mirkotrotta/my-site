'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { components } from "@/components/blog/mdxComponents";
import Script from "next/script";
import Loading from '@/components/ui/Loading';
import MDXErrorBoundary from './MDXErrorBoundary';
import GlobalContainer from '@/components/ui/GlobalContainer';
import BlogPostHeader from './BlogPostHeader';
import SidebarLayout from '@/components/ui/SidebarLayout';
import SidebarA from '@/components/ui/SidebarA';
import SidebarB from '@/components/ui/SidebarB';
import { NavigationItem } from '@/components/ui/SidebarA';
import { SidebarSection } from '@/components/ui/SidebarB';
import { generateTableOfContents, addHeadingIds } from '@/lib/toc';
import SocialSharing from './SocialSharing';
import GlobalCTA from '../ui/GlobalCTA';
import NewsletterForm from '../forms/NewsletterForm';
import useTranslation from '@/hooks/useTranslation';

export type Frontmatter = {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  coverImage?: string;
};

export interface BlogPostProps {
  post: {
    frontmatter: Frontmatter;
    content: string;
    mdxSource: MDXRemoteSerializeResult;
    slug: string;
    relatedPosts?: SidebarSection[];
    language?: string;
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  const [isContentReady, setIsContentReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<NavigationItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { language, t } = useTranslation();
  const lang = post.language || language || 'en';

  useEffect(() => {
    // Simulate potential MDX rendering delay and provide fallback if needed
    if (post?.mdxSource) {
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 100); // Small delay to ensure smooth UI
      return () => clearTimeout(timer);
    } else {
      setHasError(true);
    }
  }, [post]);

  // Generate table of contents from rendered content
  useEffect(() => {
    if (isContentReady && contentRef.current) {
      // Small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        let contentHtml = contentRef.current?.innerHTML || '';
        if (contentHtml) {
          // Add IDs to headings before generating TOC
          contentHtml = addHeadingIds(contentHtml);
          const toc = generateTableOfContents(contentHtml);
          setTableOfContents(toc);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isContentReady]);

  // Intersection Observer Scrollspy: highlight active heading in TOC
  useEffect(() => {
    if (!isContentReady || !contentRef.current || tableOfContents.length === 0) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3'));
    if (headings.length === 0) return;

    let activeId = '';
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the heading closest to the top (but still visible)
      const visible = entries.filter(e => e.isIntersecting && e.intersectionRatio > 0);
      if (visible.length > 0) {
        // Sort by boundingClientRect.top
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        activeId = visible[0].target.id;
      } else {
        // If none are visible, fallback to the last heading above the viewport
        const scrollY = window.scrollY || window.pageYOffset;
        const offset = 120;
        let lastAbove = headings[0].id;
        for (const heading of headings) {
          const rect = heading.getBoundingClientRect();
          const top = rect.top + scrollY - offset;
          if (scrollY >= top) {
            lastAbove = heading.id;
          }
        }
        activeId = lastAbove;
      }
      // Recursively set active property in TOC
      function markActive(items: NavigationItem[]): NavigationItem[] {
        return items.map((item) => {
          const isActive = item.href === `#${activeId}`;
          return {
            ...item,
            active: isActive,
            items: item.items ? markActive(item.items) : [],
          };
        });
      }
      setTableOfContents(prev => markActive(prev));
    };

    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-120px 0px 0px 0px', // Offset for sticky header
      threshold: [0, 0.1, 0.5, 1],
    });
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [isContentReady, tableOfContents]);

  // Handle missing post data
  if (!post) {
    return <Loading message="Post content unavailable" />;
  }

  const { frontmatter, mdxSource, slug, relatedPosts = [] } = post;
  const publishDate = new Date(frontmatter.date).toISOString();
  
  // Generate the cover image URL, or fallback to a placeholder
  const coverImage = frontmatter.coverImage || `https://picsum.photos/seed/${slug}/1200/600`;

  // Prepare structured data with correct URL path including language
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": frontmatter.title,
    "datePublished": publishDate,
    "dateModified": publishDate,
    "description": frontmatter.summary || "",
    "keywords": frontmatter.tags?.join(", ") || "",
    "url": `/${lang}/blog/${slug}`,
    "image": coverImage,
    "author": {
      "@type": "Person",
      "name": "Mirko Trotta"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mirko Trotta",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/${lang}/blog/${slug}`
    }
  };

  // Handle client-side error
  if (hasError) {
    // Keep the error state using GlobalContainer for simplicity
    return (
      <article className="py-10">
        <GlobalContainer className="max-w-3xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to render blog content. Please try refreshing the page.
          </p>
        </GlobalContainer>
      </article>
    );
  }

  const mdxErrorFallback = (
    <div className="prose dark:prose-invert max-w-none border border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-900/30 p-6 rounded-sm">
      <h3>Content Rendering Issue</h3>
      <p>We had trouble rendering part of this content. You can still read the available portions of the article.</p>
      <p className="text-sm">If this issue persists, please try refreshing the page.</p>
    </div>
  );

  // Content-based sidebar (table of contents)
  const contentSidebar = (
    <SidebarA
      title={t('blog.toc.title')}
      items={tableOfContents}
    />
  );

  // Related content sidebar with newsletter at the top
  const relatedContentSidebar = (
    <SidebarB 
      sections={relatedPosts || []}
    >
      <NewsletterForm language={lang} />
    </SidebarB>
  );

  return (
    <>
      {/* Add JSON-LD structured data */}
      <Script id="blogpost-ld-json" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <SidebarLayout
        sidebarLeft={contentSidebar}
        sidebarRight={relatedContentSidebar}
      >
        <article className="min-h-[800px]">
          <BlogPostHeader frontmatter={frontmatter} coverImage={coverImage} />
          {/* Main content */}
          <div 
            ref={contentRef}
            className="prose dark:prose-invert prose-headings:font-light prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline max-w-none"
          >
            {!isContentReady && (
              <div className="my-4">
                <Loading message="Rendering content..." />
              </div>
            )}
            {isContentReady && (
              <MDXErrorBoundary fallback={mdxErrorFallback}>
                <MDXRemote {...mdxSource} components={components} />
              </MDXErrorBoundary>
            )}
          </div>
          {/* Social sharing at the end of the article */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-8 mt-16">
            <SocialSharing 
              url={typeof window !== 'undefined' 
                ? `${window.location.origin}/${lang}/blog/${slug}` 
                : `/${lang}/blog/${slug}`} 
              title={frontmatter.title} 
              summary={frontmatter.summary} 
            />
          </div>
        </article>
      </SidebarLayout>

      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-16">
        <GlobalCTA
          title={t('about.cta.title')}
          subtitle={t('about.cta.subtitle')}
          buttonText={t('about.cta.primary')}
          buttonHref={`/${lang}/contact`}
          buttonTextSecondary={t('about.cta.secondary')}
          buttonHrefSecondary={`/${lang}/resume`}
        />
      </div>
    </>
  );
}
