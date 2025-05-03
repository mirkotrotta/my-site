import { getAllPosts } from './mdx';
import { SidebarSection } from '@/components/ui/SidebarB';
import { Frontmatter } from '@/components/blog/BlogPost';

// Define static translations for server component
const translations = {
  en: {
    relatedPosts: 'Related Posts',
    recentPosts: 'Recent Posts',
  },
  de: {
    relatedPosts: 'Ähnliche Beiträge',
    recentPosts: 'Neueste Beiträge',
  }
};

/**
 * Get related posts based on matching tags
 * 
 * @param currentSlug - Slug of the current post (to exclude)
 * @param currentTags - Tags of the current post to match against
 * @param count - Maximum number of related posts to return (default: 3)
 * @param language - The language code to use for translations and URLs (default: 'en')
 * @returns A SidebarSection containing related posts
 */
export async function getRelatedPosts(
  currentSlug: string,
  currentTags: string[] = [],
  count: number = 3,
  language: string = 'en'
): Promise<SidebarSection[]> {
  // Get all posts
  const allPosts = await getAllPosts();
  
  // Filter out current post and posts without tags
  const otherPosts = allPosts.filter(post => {
    return post.slug !== currentSlug && post.frontmatter.tags && post.frontmatter.tags.length > 0;
  });
  
  // Calculate tag matches and sort by number of matching tags
  const postsWithMatchCount = otherPosts.map(post => {
    const tags = post.frontmatter.tags || [];
    const matchCount = tags.filter(tag => currentTags.includes(tag)).length;
    return { post, matchCount };
  });
  
  // Sort by match count (descending) and then by date (most recent first)
  postsWithMatchCount.sort((a, b) => {
    if (a.matchCount !== b.matchCount) {
      return b.matchCount - a.matchCount;
    }
    // If match counts are equal, sort by date (most recent first)
    const dateA = new Date(a.post.frontmatter.date);
    const dateB = new Date(b.post.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Get top related posts
  const relatedPosts = postsWithMatchCount
    .slice(0, count)
    .map(item => item.post);
  
  // Get some recent posts if we don't have enough related posts
  let recentPosts: typeof allPosts = [];
  if (relatedPosts.length < count) {
    // Sort posts by date (descending)
    const sortedByDate = [...otherPosts].sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
    
    // Filter out posts that are already in relatedPosts
    const relatedSlugs = relatedPosts.map(post => post.slug);
    
    recentPosts = sortedByDate
      .filter(post => !relatedSlugs.includes(post.slug))
      .slice(0, count - relatedPosts.length);
  }
  
  // Get translations for the current language or fall back to English
  const t = translations[language as keyof typeof translations] || translations.en;
  
  // Format the related posts for SidebarB
  const sections: SidebarSection[] = [];
  
  if (relatedPosts.length > 0) {
    sections.push({
      title: t.relatedPosts,
      items: relatedPosts.map(post => ({
        title: post.frontmatter.title,
        href: `/${language}/blog/${post.slug}`,
        date: post.frontmatter.date,
        summary: post.frontmatter.summary,
        tags: post.frontmatter.tags
      })),
      viewAllLink: `/${language}/blog`
    });
  }
  
  if (recentPosts.length > 0) {
    sections.push({
      title: t.recentPosts,
      items: recentPosts.map(post => ({
        title: post.frontmatter.title,
        href: `/${language}/blog/${post.slug}`,
        date: post.frontmatter.date,
        summary: post.frontmatter.summary,
        tags: post.frontmatter.tags
      })),
      viewAllLink: `/${language}/blog`
    });
  }
  
  return sections;
} 