import { Metadata } from 'next';
import { fetchAllPosts } from '@/app/actions';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import { getDictionary } from '@/lib/dictionaries';

export const metadata: Metadata = {
  title: 'Blog | Mirko Trotta',
  description: 'Technical articles, tutorials, and insights about frontend, backend, and cloud development.',
};

export default async function BlogPage() {
  // Get the English dictionary
  const dictionary = await getDictionary('en');
  
  // Fetch all blog posts in English
  const allPosts = await fetchAllPosts('en');
  
  // Split posts for hero section and main grid
  const heroPost = allPosts[0];
  const featuredPosts = allPosts.slice(1, 4);
  const gridPosts = allPosts.slice(4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-8">{dictionary.blog.latestArticles}</h1>
        
        {allPosts.length > 0 ? (
          <>
            {heroPost && (
              <BlogHero 
                heroPost={heroPost} 
                featuredPosts={featuredPosts}
                lang="en"
              />
            )}
            
            {gridPosts.length > 0 && (
              <BlogGrid 
                posts={gridPosts}
                lang="en"
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">{dictionary.blog.noPostsAvailable}</p>
          </div>
        )}
      </div>
    </div>
  );
} 