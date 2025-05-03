import { Metadata } from 'next';
import { getPostData, isValidPostSlug } from '@/lib/mdx';
import BlogPost from '@/components/blog/BlogPost';
import { Suspense } from 'react';
import Loading from '@/components/ui/Loading';
import { getDictionary } from '@/lib/dictionaries';
import { notFound } from 'next/navigation';
import LanguageNotice from '@/components/blog/LanguageNotice';

// Define types for params
interface PageParams {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  // Important: await the params object to avoid NextJS errors
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  const lang = 'en'; // Fixed to English for this route
  const dictionary = await getDictionary(lang);
  
  // Get post data with language fallback if needed
  const postData = await getPostData(slug, lang);
  
  if (!postData) {
    return {
      title: dictionary.common.errors.notFound,
    };
  }
  
  const { frontmatter } = postData;
  
  return {
    title: `${frontmatter.title} | Mirko Trotta Blog`,
    description: frontmatter.summary || `${frontmatter.title} - Read the full article on Mirko Trotta's blog.`,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary || `${frontmatter.title} - Read the full article on Mirko Trotta's blog.`,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: ['Mirko Trotta'],
      images: frontmatter.coverImage ? [
        {
          url: frontmatter.coverImage,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.summary,
      images: frontmatter.coverImage ? [frontmatter.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  // Important: await the params object to avoid NextJS errors
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  // Use the language from the route segment (this file is in /en/ directory)
  const lang = 'en';
  const dictionary = await getDictionary(lang);
  
  // Check if the post exists in the requested language
  const existsInCurrentLang = await isValidPostSlug(slug, lang);
  
  // Check if the post exists in the other language
  const otherLang = 'de';
  const existsInOtherLang = await isValidPostSlug(slug, otherLang);
  
  // If not found in either language, show 404
  if (!existsInCurrentLang && !existsInOtherLang) {
    notFound();
  }
  
  // We know the post exists in at least one language, get the data
  const postData = await getPostData(slug, lang);
  
  // If we somehow still don't have post data, show 404
  if (!postData) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<Loading message={dictionary.blog.loadingPost} />}>
        {/* If post exists in other language but not current, show language notice */}
        {!existsInCurrentLang && existsInOtherLang && (
          <LanguageNotice 
            slug={slug}
            currentLang={lang}
            targetLang={otherLang}
            message={dictionary.blog.otherLanguageAvailable}
            linkText={dictionary.blog.readInLanguage}
          />
        )}
        
        <BlogPost post={{...postData, language: lang}} />
      </Suspense>
    </div>
  );
} 