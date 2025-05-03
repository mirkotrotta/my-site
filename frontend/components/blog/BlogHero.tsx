import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/mdx'; // Use PostData
import Button from '@/components/ui/Button'; // Import the Button component

type BlogHeroProps = {
  heroPost: PostData;
  featuredPosts: PostData[];
  lang: string; // Add language parameter
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogHero({ heroPost, featuredPosts, lang }: BlogHeroProps) {
  const heroCoverImage = heroPost.frontmatter.coverImage || `https://picsum.photos/seed/${heroPost.slug}-hero/1200/600`;

  return (
    <section className="mb-10 md:mb-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
        {/* Main Hero Post */}
        <div className="md:col-span-6 bg-white dark:bg-gray-800">
          <Link href={`/${lang}/blog/${heroPost.slug}`} className="block group">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image 
                src={heroCoverImage}
                alt={`Cover image for ${heroPost.frontmatter.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                priority // Prioritize loading the hero image
              />
            </div>
            <div className="py-0">
              <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-800">
                {/* Tag and Date */}
                <div className="flex items-center text-base text-gray-500 dark:text-gray-400 mb-4">
                  {heroPost.frontmatter.tags && heroPost.frontmatter.tags.length > 0 && (
                    <>
                      <span className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {heroPost.frontmatter.tags[0]}
                      </span>
                      <span className="mx-1">|</span>
                    </>
                  )}
                  <p className="text-sm">{formatDate(heroPost.frontmatter.date)}</p>
                </div>
                <h1 className="text-3xl font-normal mb-2">{heroPost.frontmatter.title}</h1>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Panel */}
        {featuredPosts.length > 0 && (
          <div className="md:col-span-6">
            <ul className="border-b border-transparent dark:border-transparent">
              {featuredPosts.map((post, index) => {
                const featuredCoverImage = post.frontmatter.coverImage || `https://picsum.photos/seed/${post.slug}-featured/400/200`;
                return (
                  <li key={`${lang}-${post.slug}`} className={`group grid grid-cols-12 gap-4 py-7 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${index === 0 ? 'border-t-0' : 'border-t border-gray-100 dark:border-gray-700'} ${index === featuredPosts.length - 1 ? 'border-b-0' : 'border-b border-gray-100 dark:border-gray-700'}`}>
                    <Link href={`/${lang}/blog/${post.slug}`} className="col-span-8 flex flex-col justify-between no-underline">
                      {/* Tag and Date */}
                      <div className="flex items-center text-base text-gray-500 dark:text-gray-400 mb-1">
                        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                          <>
                            <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                              {post.frontmatter.tags[0]}
                            </span>
                            <span className="mx-1">|</span>
                          </>
                        )}
                        <p className="text-xs">{formatDate(post.frontmatter.date)}</p>
                      </div>
                      <span className="text-xl font-normal text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        <h4>{post.frontmatter.title}</h4>
                      </span>
                      {/* Read More Button */}
                      <span className="mt-2 pl-0 items-center text-blue-600 dark:text-blue-400 cursor-pointer">
                       Read More
                      </span>
                    </Link>
                    <div className="col-span-4 relative aspect-[4/3] overflow-hidden">
                      <Image 
                        src={featuredCoverImage}
                        alt={`Cover image for ${post.frontmatter.title}`}
                        fill
                        sizes="33vw"
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </div>
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