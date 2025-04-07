'use client'

import { useState, useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { components } from "@/components/blog/mdxComponents";
import Script from "next/script";
import Loading from '@/components/ui/Loading';
import MDXErrorBoundary from './MDXErrorBoundary';

export type Frontmatter = {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
};

export interface BlogPostProps {
  post: {
    frontmatter: Frontmatter;
    content: string;
    mdxSource: MDXRemoteSerializeResult;
    slug: string;
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  const [isContentReady, setIsContentReady] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  // Handle missing post data
  if (!post) {
    return <Loading message="Post content unavailable" />;
  }

  const { frontmatter, mdxSource, slug } = post;
  const publishDate = new Date(frontmatter.date).toISOString();

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
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <p className="text-red-600 dark:text-red-400">
          Failed to render blog content. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const mdxErrorFallback = (
    <div className="prose dark:prose-invert max-w-none border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-6 rounded-md">
      <h3>Content Rendering Issue</h3>
      <p>We had trouble rendering part of this content. You can still read the available portions of the article.</p>
      <p className="text-sm">If this issue persists, please try refreshing the page.</p>
    </div>
  );

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      {/* Add JSON-LD structured data */}
      <Script id="blogpost-ld-json" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {frontmatter?.title && (
        <h1 className="text-3xl font-bold mb-1">{frontmatter.title}</h1>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
        {new Date(frontmatter.date).toLocaleDateString()}
      </p>
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {frontmatter.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none mt-6">
        {!isContentReady && (
          <div className="my-8">
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
  );
}
