import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/lib/mdx'; // Use PostData
import { ArrowRight } from '@carbon/icons-react'; // Import the IBM ArrowRight icon

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
    <article className="group flex flex-col h-full border border-gray-200 dark:border-gray-700 overflow-hidden pb-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {formatDate(post.frontmatter.date)}
        </p>
        <Link href={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h3>
        </Link>
        {post.frontmatter.summary && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
            {post.frontmatter.summary}
          </p>
        )}
        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="flex mt-auto">
            <Link href={`/blog?tag=${encodeURIComponent(post.frontmatter.tags[0])}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              {post.frontmatter.tags[0]}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-2 p-4">
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
          Read more
          <ArrowRight className="ml-3 w-5 h-5" />
        </Link>
      </div>
    </article>
  );
}