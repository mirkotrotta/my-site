import Link from 'next/link';

export type CategoryBarProps = {
  tags: string[];
  currentTag?: string;
  lang?: string;
};

export default function CategoryBar({ tags, currentTag, lang = 'en' }: CategoryBarProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Filter text based on language
  const filterText = lang === 'de' ? 'Nach Kategorie filtern:' : 'Filter by Category:';
  const allText = lang === 'de' ? 'Alle' : 'All';

  return (
    <section className="mb-10 md:mb-14 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-0">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-6 py-3">
          {filterText}
        </span>
        {/* "All" link */}
        <Link 
          href={`/${lang}/blog`}
          className={`
            py-3 px-4 text-sm font-normal border-b-2 transition-colors
            ${!currentTag 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'border-transparent text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400'
            }
          `}
        >
          {allText}
        </Link>
        {/* Individual tag links */}
        {tags.map(tag => {
          const isActive = currentTag?.toLowerCase() === tag.toLowerCase();
          return (
            <Link 
              key={tag} 
              href={`/${lang}/blog?tag=${encodeURIComponent(tag)}`}
              className={`
                py-3 px-4 text-sm font-normal border-b-2 transition-colors
                ${isActive 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400'
                }
              `}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </section>
  );
} 