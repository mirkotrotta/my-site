import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/mdx';
import { MoveRight } from 'lucide-react';
import Button from '@/components/ui/Button';

type BlogCardProps = {
  post: PostData;
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogCard({ post }: BlogCardProps) {
  const coverImage = post.frontmatter.coverImage || `https://picsum.photos/seed/${post.slug}-card/600/400`;

  return (
    <article className="group flex flex-col h-full overflow-hidden pb-4 transition-all duration-200">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden mb-3">
          <Image 
            src={coverImage}
            alt={`Cover image for ${post.frontmatter.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center text-base text-gray-500 dark:text-gray-400 mb-4">
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <>
              <Link href={`/blog?tag=${encodeURIComponent(post.frontmatter.tags[0])}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {post.frontmatter.tags[0]}
              </Link>
              <span className="mx-1">|</span>
            </>
          )}
          <p>{formatDate(post.frontmatter.date)}</p>
        </div>
        <Link href={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h3>
        </Link>
      </div>
      <div className="mt-8">
        <Button 
          href={`/blog/${post.slug}`} 
          variant="link"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 group-hover:underline"
        >
          <MoveRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </article>
  );
}