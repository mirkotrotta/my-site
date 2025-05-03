import Link from 'next/link';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import { Frontmatter } from '@/lib/mdx';
import { MoveRight } from 'lucide-react';

type BlogCardProps = {
  post: {
    slug: string;
    frontmatter: Frontmatter;
    language?: string;
  };
};

// Helper to format date
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export default function BlogCard({ post }: BlogCardProps) {
  const { language } = useTranslation();
  const lang = post.language || language || 'en';
  const { slug, frontmatter } = post;
  const coverImage =
    frontmatter.coverImage || `https://picsum.photos/seed/${slug}-card/600/400`;

  return (
    <Link
      href={`/${lang}/blog/${slug}`}
      className="group flex flex-col h-full overflow-hidden pb-4 transition-all duration-200 no-underline bg-white dark:bg-gray-900"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden mb-3">
        <Image
          src={coverImage}
          alt={`Cover image for ${frontmatter.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          priority={false}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center text-base text-gray-500 dark:text-gray-400 mb-4">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <>
              <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {frontmatter.tags[0]}
              </span>
              <span className="mx-1">|</span>
            </>
          )}
          <p>{formatDate(frontmatter.date)}</p>
        </div>
        <span className="block mb-2">
          <h3 className="text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {frontmatter.title}
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