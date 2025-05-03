import { PostData } from '@/lib/mdx';
import BlogCard from './BlogCard';
import useTranslation from '@/hooks/useTranslation';

type BlogGridProps = {
  posts: PostData[];
};

export default function BlogGrid({ posts }: BlogGridProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const { language } = useTranslation();
  const lang = posts[0]?.language || language || 'en';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {posts.map((post) => (
        <BlogCard 
          key={`${lang}-${post.slug}`} 
          post={post} 
        />
      ))}
    </div>
  );
} 