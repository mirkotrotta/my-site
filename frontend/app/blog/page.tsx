import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogHero from '@/components/blog/BlogHero';
import CategoryBar from '@/components/blog/CategoryBar';
import BlogCard from '@/components/blog/BlogCard';
import CallToAction from '@/components/blog/CallToAction';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights on technology, design, and more.',
  openGraph: {
    title: 'Blog',
    description: 'Read our latest articles and insights on technology, design, and more.',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/blog-index-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'Blog Posts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'Read our latest articles and insights on technology, design, and more.',
    images: ['https://picsum.photos/seed/blog-index-twitter/800/400'],
  },
};

export default async function BlogIndexPage({ searchParams }: { searchParams: { tag?: string } }) {
  try {
    const tag = searchParams.tag;
    const allPosts = getAllPosts();

    const filteredPosts = tag
      ? allPosts.filter(post => post.frontmatter.tags?.some(t => t.toLowerCase() === tag.toLowerCase()))
      : allPosts;

    const allTags = [...new Set(allPosts.flatMap(post => post.frontmatter.tags || []))].sort();

    const heroPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const featuredPosts = allPosts.filter(p => p.slug !== heroPost?.slug).slice(0, 3);
    const mainGridPosts = tag ? filteredPosts.slice(heroPost ? 1 : 0) : filteredPosts.slice(1, 7);
    const latestNewsPosts = !tag ? allPosts.slice(7, 10) : [];

    return (
      <div className="py-16 bg-white dark:bg-gray-900">
        {heroPost && (
          <div className="mb-12">
            <BlogHero heroPost={heroPost} featuredPosts={featuredPosts} />
          </div>
        )}

        <div className="mb-12">
          <CategoryBar tags={allTags} currentTag={tag} />
        </div>

        <section className="mb-16">
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className="text-sm font-semibold tracking-widest text-gray-500 dark:text-gray-400">
              {tag ? `Articles tagged with \"${tag}\"` : 'Latest Articles'}
            </h2>
          </div>
          {mainGridPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainGridPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50">
              <p className="text-gray-600 dark:text-gray-400">
                {tag ? `No posts found with tag \"${tag}\".` : 'No posts available right now.'}
              </p>
              {tag && (
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                >
                  View all posts
                </Link>
              )}
            </div>
          )}
        </section>

        {!tag && latestNewsPosts.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                More Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNewsPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12">
          <CallToAction />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog index:', error);
    return (
      <section className="py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h1>
        <p>There was an error loading the blog posts. Please try again later.</p>
      </section>
    );
  }
}
