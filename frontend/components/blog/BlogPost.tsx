'use client'

import { useState, useEffect, useRef } from 'react';
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
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  const [isContentReady, setIsContentReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<NavigationItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

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
        const contentHtml = contentRef.current?.innerHTML || '';
        if (contentHtml) {
          const toc = generateTableOfContents(contentHtml);
          setTableOfContents(toc);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isContentReady]);

  // Handle missing post data
  if (!post) {
    return <Loading message="Post content unavailable" />;
  }

  const { frontmatter, mdxSource, slug, relatedPosts = [] } = post;
  const publishDate = new Date(frontmatter.date).toISOString();
  
  // Generate the cover image URL, or fallback to a placeholder
  const coverImage = frontmatter.coverImage || `https://picsum.photos/seed/${slug}/1200/600`;

  // Prepare structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": frontmatter.title,
    "datePublished": publishDate,
    "dateModified": publishDate,
    "description": frontmatter.summary || "",
    "keywords": frontmatter.tags?.join(", ") || "",
    "url": `/blog/${slug}`,
    "image": coverImage,
    "author": {
      "@type": "Person",
      "name": "Site Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Moon Site",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/blog/${slug}`
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
  const contentSidebar = tableOfContents.length > 0 ? (
    <SidebarA
      title="In this article"
      items={tableOfContents}
    />
  ) : undefined;

  // Related content sidebar with social sharing
  const relatedContentSidebar = (
    <SidebarB
      title="Related Content"
      sections={relatedPosts}
    >
      <SocialSharing 
        url={`/blog/${slug}`}
        title={frontmatter.title}
        summary={frontmatter.summary || ''}
      />
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
        </article>
      </SidebarLayout>
    </>
  );
}
