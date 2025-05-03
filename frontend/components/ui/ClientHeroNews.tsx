"use client";

import { useEffect, useState } from "react";
import BlogCardSimple from "@/components/blog/BlogCardSimple";
import { fetchAllPosts, PostData } from "@/app/actions";
import useTranslation from "@/hooks/useTranslation";

export default function ClientHeroNews() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts for the current language only
        const allPosts = await fetchAllPosts(language);
        const latest = allPosts.slice(0, 3);
        setPosts(latest);
      } catch (err) {
        console.error("Error loading sidebar posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [language]);

  return (
    <div className="space-y-4 pl-0">
      {loading ? (
        <p className="text-gray-500 text-sm">Loading news...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <BlogCardSimple 
            key={`${post.language}-${post.slug}`}
            post={post}
            lang={post.language}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No news articles found.</p>
      )}
    </div>
  );
}
