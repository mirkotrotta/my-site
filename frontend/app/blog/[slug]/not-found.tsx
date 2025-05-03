'use client'

import Link from 'next/link'
import useTranslation from '@/hooks/useTranslation'

export default function BlogNotFound() {
  const { language: lang, t } = useTranslation()

  return (
    <div className="py-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {t('blog.notFound.title') || 'Blog Post Not Found'}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {t('blog.notFound.message') || "The blog post you're looking for doesn't exist or has been moved."}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href={`/${lang}/blog`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          {t('blog.notFound.browseAll') || 'Browse all articles'}
        </Link>
        <Link
          href={`/${lang}`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition"
        >
          {t('blog.notFound.goHome') || 'Go to homepage'}
        </Link>
      </div>
    </div>
  )
} 