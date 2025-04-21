import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogHero from '@/components/blog/BlogHero';
import CategoryBar from '@/components/blog/CategoryBar';
import BlogCard from '@/components/blog/BlogCard';
import CallToAction from '@/components/blog/CallToAction';
import Link from 'next/link';
import GlobalCTA from '@/components/ui/GlobalCTA';

export const metadata: Metadata = {
  metadataBase: new URL('http://127.0.0.1:4000'),
  title: 'System Logs – Dev Blog by Mirko Trotta',
  description: 'System Logs is the personal developer blog of Mirko Trotta, a full stack engineer based in Germany. Tutorials, case studies, and insights on backend systems, automation, and developer tools.',
  openGraph: {
    title: 'System Logs – Dev Blog by Mirko Trotta',
    description: 'Explore tutorials, backend insights, and real-world developer workflows on System Logs — the blog of Mirko Trotta, full stack engineer based in Germany.',
    type: 'website',
    locale: 'en_DE',
    images: [
      {
        url: '/images/Latest Trends, Guides, and Reviews in Digital Innovation, Mirko Trotta Blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Posts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System Logs – Developer Blog by Mirko Trotta',
    description: 'Explore tutorials, backend insights, and real-world developer workflows on System Logs — the blog of Mirko Trotta, full stack engineer based in Germany.',
    images: ['/images/Latest Trends, Guides, and Reviews in Digital Innovation, Mirko Trotta Blog.jpg'],
  },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  try {
    const { tag } = await searchParams;
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
      <div className="py-12 bg-white dark:bg-gray-900">
        {heroPost && (
          <div className="mb-12">
            <BlogHero heroPost={heroPost} featuredPosts={featuredPosts} />
          </div>
        )}

        <div className="mb-12">
          <CategoryBar tags={allTags} currentTag={tag} />
        </div>

        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                {tag ? `Articles tagged with \"${tag}\"` : 'Latest Articles'}
              </h2>
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View All Articles
              </Link>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainGridPosts.length > 0 ? (
                mainGridPosts.map(post => (
                  <BlogCard key={post.slug} post={post} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
                  {tag ? `No posts found with tag \"${tag}\".` : 'No posts available right now.'}
                </p>
              )}
            </div>
          </div>
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

<div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-16">
        <GlobalCTA
          title="Let's connect"
          subtitle="Open to connecting around thoughtful systems, internal tooling, or automation — especially where structure and clarity matter."
          buttonText="Contact Me"
          buttonHref="/contact"
          buttonTextSecondary="Download Resume"
          buttonHrefSecondary="/resume"
          className="bg-gray-100 dark:bg-gray-800"
        />
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
