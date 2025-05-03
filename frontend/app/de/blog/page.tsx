import { Metadata } from 'next';
import { fetchAllPosts } from '@/app/actions';
import BlogHero from '@/components/blog/BlogHero';
import { getDictionary } from '@/lib/dictionaries';

export const metadata: Metadata = {
  title: 'Blog | Mirko Trotta',
  description: 'Technische Artikel, Tutorials und Einblicke zur Frontend-, Backend- und Cloud-Entwicklung.',
};

export default async function BlogPage() {
  // Get the German dictionary
  const dictionary = await getDictionary('de');
  
  // Fetch all blog posts in German
  const allPosts = await fetchAllPosts('de');
  
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
                lang="de"
              />
            )}
            
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {gridPosts.map((post) => (
                  <div key={`de-${post.slug}`} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    {/* You can import and use a BlogCard component here */}
                    <a href={`/de/blog/${post.slug}`} className="block p-4">
                      <h3 className="text-xl font-medium mb-2">{post.frontmatter.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{post.frontmatter.date}</p>
                    </a>
                  </div>
                ))}
              </div>
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