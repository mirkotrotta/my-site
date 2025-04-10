import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/mdx'; // Use PostData

type BlogHeroProps = {
  heroPost: PostData;
  featuredPosts: PostData[];
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogHero({ heroPost, featuredPosts }: BlogHeroProps) {
  const heroCoverImage = heroPost.frontmatter.coverImage || `https://picsum.photos/seed/${heroPost.slug}-hero/1200/600`;

  return (
    <section className="mb-10 md:mb-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Main Hero Post (spans 8 columns on md+) */}
        <div className="md:col-span-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Link href={`/blog/${heroPost.slug}`} className="block group">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image 
                src={heroCoverImage}
                alt={`Cover image for ${heroPost.frontmatter.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                priority // Prioritize loading the hero image
              />
            </div>
            <div className="p-4 pb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {formatDate(heroPost.frontmatter.date)}
              </p>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {heroPost.frontmatter.title}
              </h2>
              {heroPost.frontmatter.summary && (
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {heroPost.frontmatter.summary}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Side Panel - Featured News (spans 4 columns on md+) */}
        {featuredPosts.length > 0 && (
          <div className="md:col-span-4">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4 pb-1 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              Featured News
            </h3>
            <ul className="space-y-6">
              {featuredPosts.map((post) => {
                const featuredCoverImage = post.frontmatter.coverImage || `https://picsum.photos/seed/${post.slug}-featured/400/200`;
                return (
                  <li key={post.slug} className="group">
                    <Link href={`/blog/${post.slug}`} className="grid grid-cols-12 gap-3">
                      <div className="col-span-4 relative aspect-[4/3] overflow-hidden">
                        <Image 
                          src={featuredCoverImage}
                          alt={`Cover image for ${post.frontmatter.title}`}
                          fill
                          sizes="33vw"
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      </div>
                      <div className="col-span-8">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {formatDate(post.frontmatter.date)}
                        </p>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.frontmatter.title}
                        </h4>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
} 