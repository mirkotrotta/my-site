import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define constants for the legal directory paths
const BASE_LEGAL_DIR = path.join(process.cwd(), "content/legal");
const LEGAL_DIR = {
  en: path.join(BASE_LEGAL_DIR, "en"),
  de: path.join(BASE_LEGAL_DIR, "de")
};

// Default language to fall back to
const DEFAULT_LANGUAGE = 'en';

export interface LegalFrontmatter {
  title: string;
  lastUpdated: string;
}

export interface LegalData {
  slug: string;
  frontmatter: LegalFrontmatter;
  content: string;
  htmlContent: string;
  language: string;
}

/**
 * Convert markdown content to HTML with better formatting
 */
function markdownToHtml(markdown: string): string {
  // First, normalize line endings and trim
  let html = markdown.replace(/\r\n/g, '\n').trim();
  
  // Process block-level elements first
  html = html
    // Headers (process from h3 to h1 to avoid conflicts)
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-4 mt-8 text-gray-900 dark:text-white">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-6 mt-10 text-gray-900 dark:text-white">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">$1</h1>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-gray-300 dark:border-gray-700" />');
  
  // Process inline elements
  html = html
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    
    // Links - handle [text](url) format
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline transition-colors">$1</a>');
  
  // Process lists
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if this line is a list item
    if (trimmedLine.match(/^- (.+)/)) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-2 mb-6 ml-4">');
        inList = true;
      }
      const listContent = trimmedLine.replace(/^- (.+)/, '$1');
      processedLines.push(`<li class="text-gray-700 dark:text-gray-300">${listContent}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  // Close any open list
  if (inList) {
    processedLines.push('</ul>');
  }
  
  html = processedLines.join('\n');
  
  // Process paragraphs - split by double newlines
  const paragraphs = html.split(/\n\s*\n/);
  const processedParagraphs = paragraphs.map(paragraph => {
    paragraph = paragraph.trim();
    if (!paragraph) return '';
    
    // Skip if already wrapped in HTML block tags
    if (paragraph.match(/^<(h[1-6]|hr|ul|div)/)) {
      return paragraph;
    }
    
    // Check if it's just a single line that might be part of a structure
    if (!paragraph.includes('\n') && paragraph.length < 200) {
      return `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${paragraph}</p>`;
    }
    
    // For multi-line content, split by single newlines and wrap each as a paragraph
    const lines = paragraph.split('\n').filter(line => line.trim());
    return lines
      .map(line => line.trim())
      .filter(line => line && !line.match(/^<(h[1-6]|hr|ul|div)/))
      .map(line => `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`)
      .join('\n');
  });
  
  return processedParagraphs
    .filter(p => p)
    .join('\n\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    .trim();
}

/**
 * Get legal content by slug and language
 */
export async function getLegalContent(
  slug: string, 
  language: string = DEFAULT_LANGUAGE
): Promise<LegalData | null> {
  try {
    // Get the legal directory for the specified language, falling back to default
    const legalDir = LEGAL_DIR[language as keyof typeof LEGAL_DIR] || LEGAL_DIR[DEFAULT_LANGUAGE];
    
    // Check if the corresponding MD file exists
    const filePath = path.join(legalDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Legal file not found: ${filePath}`);
      return null;
    }

    // Read the file content
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContents);

    // Convert markdown to HTML
    const htmlContent = markdownToHtml(content);

    return {
      slug,
      frontmatter: frontmatter as LegalFrontmatter,
      content,
      htmlContent,
      language
    };
  } catch (error) {
    console.error(`Error reading legal content for ${slug}:`, error);
    return null;
  }
}

/**
 * Get all available legal content for a language
 */
export function getAllLegalContent(language: string = DEFAULT_LANGUAGE): LegalData[] {
  try {
    const legalDir = LEGAL_DIR[language as keyof typeof LEGAL_DIR] || LEGAL_DIR[DEFAULT_LANGUAGE];
    
    if (!fs.existsSync(legalDir)) {
      return [];
    }

    const files = fs.readdirSync(legalDir);
    const legalContent: LegalData[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(legalDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContents);

        // Convert markdown to HTML
        const htmlContent = markdownToHtml(content);

        legalContent.push({
          slug,
          frontmatter: frontmatter as LegalFrontmatter,
          content,
          htmlContent,
          language
        });
      }
    }

    return legalContent;
  } catch (error) {
    console.error(`Error reading legal content for language ${language}:`, error);
    return [];
  }
}

/**
 * Check if legal content exists for a given slug and language
 */
export function legalContentExists(slug: string, language: string = DEFAULT_LANGUAGE): boolean {
  try {
    const legalDir = LEGAL_DIR[language as keyof typeof LEGAL_DIR] || LEGAL_DIR[DEFAULT_LANGUAGE];
    const filePath = path.join(legalDir, `${slug}.md`);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
} 