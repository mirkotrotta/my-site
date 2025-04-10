import { NavigationItem } from '@/components/ui/SidebarA';

/**
 * Extract headings from HTML content and generate a table of contents
 * 
 * @param html - HTML content string to extract headings from
 * @param maxDepth - Maximum heading level to include (default: 3 = h1, h2, h3)
 * @returns Array of NavigationItem objects
 */
export function generateTableOfContents(html: string, maxDepth = 3): NavigationItem[] {
  const toc: NavigationItem[] = [];
  const headingRegex = /<h([1-6])(?:[^>]*id="([^"]*)"[^>]*)?>(.*?)<\/h\1>/g;
  
  // A stack to track the current parent items at each level
  const stack: NavigationItem[][] = [toc];
  for (let i = 1; i <= 6; i++) {
    stack[i] = [];
  }
  
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    
    // Skip headings deeper than maxDepth
    if (level > maxDepth) continue;
    
    // Extract heading content (removing any HTML tags)
    let title = match[3].replace(/<[^>]*>/g, '');
    
    // Get or generate ID
    const id = match[2] || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    const item: NavigationItem = {
      title,
      href: `#${id}`,
      items: []
    };
    
    // Add item to the appropriate level
    if (level === 1) {
      toc.push(item);
    } else {
      // Find the most recent parent
      let parentLevel = level - 1;
      while (parentLevel >= 1) {
        const parent = stack[parentLevel][stack[parentLevel].length - 1];
        if (parent) {
          if (!parent.items) parent.items = [];
          parent.items.push(item);
          break;
        }
        parentLevel--;
      }
      
      // If no parent found, add to root
      if (parentLevel < 1) {
        toc.push(item);
      }
    }
    
    // Update the stack at this level
    stack[level] = [...stack[level], item];
  }
  
  return toc;
}

/**
 * Add IDs to headings in HTML content that don't already have them
 * 
 * @param html - HTML content to process
 * @returns Modified HTML with IDs added to headings
 */
export function addHeadingIds(html: string): string {
  // Replace headings without IDs
  return html.replace(
    /<h([1-6])(?![^>]*id=)([^>]*)>(.*?)<\/h\1>/g,
    (match, level, attrs, content) => {
      // Extract text content without HTML tags
      const text = content.replace(/<[^>]*>/g, '');
      // Generate ID from text content
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    }
  );
} 