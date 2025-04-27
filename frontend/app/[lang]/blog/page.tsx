import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogHero from '@/components/blog/BlogHero';
import CategoryBar from '@/components/blog/CategoryBar';
import BlogCard from '@/components/blog/BlogCard';
import GlobalCTA from '@/components/ui/GlobalCTA';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  
  return {
    title: dictionary.blog.metaTitle,
    description: dictionary.blog.metaDescription,
    openGraph: {
      title: dictionary.blog.metaTitle,
      description: dictionary.blog.metaDescription,
      type: 'website',
      locale: lang === 'en' ? 'en_US' : 'de_DE',
      images: [
        {
          url: '/images/Latest Trends, Guides, and Reviews in Digital Innovation, Mirko Trotta Blog.jpg',
          width: 1200,
          height: 630,
          alt: dictionary.blog.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.blog.metaTitle,
      description: dictionary.blog.metaDescription,
      images: ['/images/Latest Trends, Guides, and Reviews in Digital Innovation, Mirko Trotta Blog.jpg'],
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { tag?: string };
}) {
  const { lang } = params;
  const { tag } = searchParams;
  const dictionary = await getDictionary(lang);
  
  try {
    // Get all posts filtered by the current language
    const allPosts = getAllPosts(lang);

    // Filter posts by tag if provided
    const filteredPosts = tag
      ? allPosts.filter(post => post.frontmatter.tags?.some(t => t.toLowerCase() === tag.toLowerCase()))
      : allPosts;

    // Extract all unique tags from posts
    const allTags = [...new Set(allPosts.flatMap(post => post.frontmatter.tags || []))].sort();

    // Set up featured posts
    const heroPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const featuredPosts = allPosts.filter(p => p.slug !== heroPost?.slug).slice(0, 3);
    const mainGridPosts = tag ? filteredPosts.slice(heroPost ? 1 : 0) : filteredPosts.slice(1, 7);
    const latestNewsPosts = !tag ? allPosts.slice(7, 10) : [];

    return (
      <div className="py-12 bg-white dark:bg-gray-900">
        {heroPost && (
          <div className="mb-12">
            <BlogHero heroPost={heroPost} featuredPosts={featuredPosts} />
          </div>
        )}

        <div className="mb-12">
          <CategoryBar tags={allTags} currentTag={tag} lang={lang} />
        </div>

        <Suspense fallback={<Loading className="py-16" />}>
          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                  {tag ? `${dictionary.blog.taggedWith} "${tag}"` : dictionary.blog.latestArticles}
                </h2>
                <Link href={`/${lang}/blog`} className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                  {dictionary.blog.viewAll}
                </Link>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mainGridPosts.length > 0 ? (
                  mainGridPosts.map(post => (
                    <BlogCard key={post.slug} post={post} lang={lang} />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
                    {tag ? `${dictionary.blog.noPostsWithTag} "${tag}".` : dictionary.blog.noPostsAvailable}
                  </p>
                )}
              </div>
            </div>
          </section>
        </Suspense>

        {!tag && latestNewsPosts.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {dictionary.blog.moreArticles}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNewsPosts.map(post => (
                <BlogCard key={post.slug} post={post} lang={lang} />
              ))}
            </div>
          </section>
        )}

        <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-16">
          <GlobalCTA
            title={dictionary.common.cta.title}
            subtitle={dictionary.common.cta.subtitle}
            buttonText={dictionary.common.cta.contactButton}
            buttonHref={`/${lang}/contact`}
            buttonTextSecondary={dictionary.common.cta.resumeButton}
            buttonHrefSecondary={`/${lang}/resume`}
            className="bg-gray-100 dark:bg-gray-800"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog index:', error);
    return (
      <section className="py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{dictionary.common.errors.blogLoadError}</h1>
        <p>{dictionary.common.errors.tryAgainLater}</p>
      </section>
    );
  }
} 