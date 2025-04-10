import { ReactNode } from 'react';
import SidebarLayout from '../ui/SidebarLayout';
import SidebarA from '../ui/SidebarA';
import SidebarB from '../ui/SidebarB';
import { NavigationItem } from '../ui/SidebarA';
import { SidebarSection } from '../ui/SidebarB';

type ExampleBlogWithSidebarsProps = {
  children: ReactNode;
  tableOfContents: NavigationItem[];
  relatedPosts: SidebarSection[];
};

/**
 * ExampleBlogWithSidebars - A demonstration component showing how to use
 * SidebarA and SidebarB components with blog content.
 * 
 * This is an example component that can be used as a template for
 * implementing sidebars in blog posts or other content pages.
 */
export default function ExampleBlogWithSidebars({
  children,
  tableOfContents,
  relatedPosts,
}: ExampleBlogWithSidebarsProps) {
  // Configure the left sidebar (SidebarA) for table of contents
  const contentSidebar = (
    <SidebarA
      title="Table of Contents"
      items={tableOfContents}
    />
  );

  // Configure the right sidebar (SidebarB) for related content
  const relatedContentSidebar = (
    <SidebarB
      title="Related Content"
      sections={relatedPosts}
    >
      {/* Optional: Additional content that can be passed as children */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Subscribe to Newsletter</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Get the latest updates directly to your inbox.
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-grow border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm"
          />
          <button className="border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
            Subscribe
          </button>
        </div>
      </div>
    </SidebarB>
  );

  // Use the SidebarLayout to arrange the sidebars and main content
  return (
    <SidebarLayout
      sidebarLeft={contentSidebar}
      sidebarRight={relatedContentSidebar}
    >
      <article className="prose dark:prose-invert max-w-none">
        {children}
      </article>
    </SidebarLayout>
  );
}

// Example of how to use this component:
/*
import ExampleBlogWithSidebars from '@/components/blog/ExampleBlogWithSidebars';

export default function BlogPage() {
  // Example table of contents
  const toc = [
    { title: 'Introduction', href: '#introduction', active: true },
    { title: 'Getting Started', href: '#getting-started' },
    { 
      title: 'Advanced Topics', 
      href: '#advanced', 
      items: [
        { title: 'Configuration', href: '#configuration' },
        { title: 'Customization', href: '#customization' },
      ]
    },
    { title: 'Conclusion', href: '#conclusion' }
  ];

  // Example related content
  const related = [
    {
      title: 'Recent Posts',
      items: [
        {
          title: 'Getting Started with React',
          href: '/blog/react-basics',
          date: '2023-04-15',
          summary: 'Learn the fundamentals of React development',
          tags: ['React', 'JavaScript']
        },
        {
          title: 'Advanced TypeScript Patterns',
          href: '/blog/typescript-patterns',
          date: '2023-03-22',
          tags: ['TypeScript', 'Patterns']
        }
      ],
      viewAllLink: '/blog'
    },
    {
      title: 'Popular Categories',
      items: [
        { title: 'JavaScript', href: '/categories/javascript' },
        { title: 'React', href: '/categories/react' },
        { title: 'TypeScript', href: '/categories/typescript' }
      ]
    }
  ];

  return (
    <ExampleBlogWithSidebars
      tableOfContents={toc}
      relatedPosts={related}
    >
      <h1>My Example Blog Post</h1>
      <p>This is an example of blog content...</p>
      {/* Your MDX or other content would go here *//*}
    </ExampleBlogWithSidebars>
  );
}
*/ 