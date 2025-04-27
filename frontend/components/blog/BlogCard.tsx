import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/mdx';
import { MoveRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export type BlogCardProps = {
  post: PostData;
  lang?: string;
};

// Helper to format date based on locale
const formatDate = (dateString: string, locale: string = 'en-US') => {
  return new Date(dateString).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogCard({ post, lang = 'en' }: BlogCardProps) {
  const coverImage = post.frontmatter.coverImage || `https://picsum.photos/seed/${post.slug}-card/600/400`;
  // Use language-specific route for the blog post
  const postUrl = `/${lang}/blog/${post.slug}`;

  return (
    <Link href={postUrl} className="group flex flex-col h-full overflow-hidden pb-4 transition-all duration-200 no-underline">
      <div className="relative aspect-[16/9] w-full overflow-hidden mb-3">
        <Image 
          src={coverImage}
          alt={`Cover image for ${post.frontmatter.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center text-base text-gray-500 dark:text-gray-400 mb-4">
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <>
              <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {post.frontmatter.tags[0]}
              </span>
              <span className="mx-1">|</span>
            </>
          )}
          <p>{formatDate(post.frontmatter.date, lang)}</p>
        </div>
        <span className="block mb-2">
          <h3 className="text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h3>
        </span>
      </div>
      <div className="mt-8">
        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 group-hover:underline">
          <MoveRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}