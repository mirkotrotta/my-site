// app/blog/[slug]/page.tsx

import { Metadata } from 'next';
import { getPostData, getAllPosts } from '@/lib/mdx';
import BlogPost from '@/components/blog/BlogPost';
import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

/**
 * Generate static paths for all blog posts at build time
 * This ensures consistent slug-to-file mapping based on filenames
 */
export async function generateStaticParams() {
  // Read directory content directly to ensure consistent slug generation
  const blogDir = path.join(process.cwd(), 'content/blog');
  
  // Make sure the blog directory exists
  if (!fs.existsSync(blogDir)) {
    console.warn('Blog directory not found:', blogDir);
    return [];
  }
  
  // Get all MDX files and extract slugs from filenames
  const filenames = fs.readdirSync(blogDir);
  
  // Only consider .mdx files and strip the extension to get the slug
  const slugs = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => ({
      // Extract slug from filename (remove .mdx extension)
      slug: filename.replace(/\.mdx$/, '')
    }));
  
  return slugs;
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  try {
    // In Next.js 15, params is a Promise that must be awaited
    const { slug } = await params;
    
    // Get post data using the slug
    const post = await getPostData(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found'
      }
    }
    
    const { frontmatter } = post;
    
    return {
      title: frontmatter.title,
      description: frontmatter.summary || `${frontmatter.title} - Blog Post`,
      keywords: frontmatter.tags,
      authors: [{ name: 'Site Author' }],
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.summary || `${frontmatter.title} - Blog Post`,
        type: 'article',
        publishedTime: frontmatter.date,
        tags: frontmatter.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.summary || `${frontmatter.title} - Blog Post`,
      },
      alternates: {
        canonical: `/blog/${slug}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error Loading Post',
      description: 'There was an error loading this blog post'
    }
  }
}

export default async function BlogPostPage(
  { params }: BlogPostPageProps
) {
  try {
    // In Next.js 15, params is a Promise that must be awaited
    const { slug } = await params;
    
    if (!slug) {
      return notFound();
    }
    
    // Get post data using the slug
    const post = await getPostData(slug);
    if (!post) {
      return notFound();
    }
    
    const postWithSlug = {
      ...post,
      slug: slug
    };
    
    return <BlogPost post={postWithSlug} />
  } catch (error) {
    console.error('Error rendering blog post:', error);
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h1>
        <p>There was an error loading this blog post. Please try again later.</p>
      </div>
    );
  }
}
