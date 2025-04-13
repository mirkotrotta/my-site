"use client";

import { useEffect, useState } from "react";
import BlogCardSimple from "@/components/blog/BlogCardSimple";
import { fetchAllPosts, PostData } from "@/app/actions";

export default function ClientHeroNews() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await fetchAllPosts();
        const latest = allPosts.slice(0, 3);
        setPosts(latest);
      } catch (err) {
        console.error("Error loading sidebar posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500 text-sm">Loading news...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <BlogCardSimple key={post.slug} post={post} />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No news articles found.</p>
      )}
    </div>
  );
}
