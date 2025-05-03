"use client";

import { useEffect, useState } from "react";
import { fetchAllPosts, PostData } from "./actions";
import BlogCard from "@/components/blog/BlogCard";
import Button from "@/components/ui/Button";
import useTranslation from "@/hooks/useTranslation";

export default function ClientBlogSection() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await fetchAllPosts(language);
        const recentPosts = allPosts.slice(0, 6);
        setPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">{t("blog.title")}</h2>
          <Button href={`/${language}/blog`} variant="link" showArrow={false} className="pl-0">{t("blog.viewAll")}</Button>
        </div>
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">{t("common.loading")}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <BlogCard
                key={`${post.language}-${post.slug}`}
                post={post}
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">{t("blog.noPosts")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
