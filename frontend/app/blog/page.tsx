// frontend/app/blog/page.tsx
import { Metadata } from 'next';
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights',
  openGraph: {
    title: 'Blog',
    description: 'Read our latest articles and insights',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog',
    description: 'Read our latest articles and insights',
  },
}

type BlogPageProps = {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogIndexPage(
  { searchParams }: BlogPageProps
) {
  try {
    // In Next.js 15, searchParams is a Promise that must be awaited
    const { tag } = await searchParams;
    
    const allPosts = getAllPosts();
    
    // Filter posts by tag if a tag is specified
    const posts = tag 
      ? allPosts.filter(post => 
          post.frontmatter.tags?.some(t => 
            t.toLowerCase() === tag.toLowerCase()
          )
        )
      : allPosts;
    
    // Extract all unique tags from posts
    const allTags = [...new Set(
      allPosts.flatMap(post => post.frontmatter.tags || [])
    )].sort();

    return (
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">
          {tag ? `Blog: ${tag}` : 'Blog'}
        </h1>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Filter by tag:</h2>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/blog"
                className={`px-3 py-1 text-sm rounded-full ${!tag ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                All
              </Link>
              {allTags.map(tagName => (
                <Link 
                  key={tagName} 
                  href={`/blog?tag=${encodeURIComponent(tagName)}`}
                  className={`px-3 py-1 text-sm rounded-full ${tag === tagName ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {tagName}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* No posts message */}
        {posts.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {tag ? `No posts found with tag "${tag}"` : 'No posts found'}
            </p>
            {tag && (
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                View all posts
              </Link>
            )}
          </div>
        )}
        
        {/* Posts list */}
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:underline">
                  {post.frontmatter.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </p>
                
                {/* Tags */}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {post.frontmatter.tags.map(tagName => (
                      <span 
                        key={tagName} 
                        className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tagName}
                      </span>
                    ))}
                  </div>
                )}
                
                {post.frontmatter.summary && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {post.frontmatter.summary}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  } catch (error) {
    console.error('Error rendering blog index:', error);
    return (
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h1>
        <p>There was an error loading the blog posts. Please try again later.</p>
      </section>
    );
  }
}
