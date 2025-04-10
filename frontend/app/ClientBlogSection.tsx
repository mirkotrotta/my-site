"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCardSimple from "@/components/blog/BlogCardSimple";
import GlobalContainer from "@/components/ui/GlobalContainer";
import { fetchAllPosts, PostData } from "./actions";

export default function ClientBlogSection() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog posts
    const fetchPosts = async () => {
      try {
        const allPosts = await fetchAllPosts();
        // Get the 6 most recent posts
        const recentPosts = allPosts.slice(0, 6);
        setPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-16">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Latest Articles</h2>
          <Link 
            href="/blog" 
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            View all articles
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center py-8">Loading blog posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <BlogCardSimple key={post.slug} post={post} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center py-8">No blog posts found.</p>
          )}
        </div>
    </section>
  );
} 