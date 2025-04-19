import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="py-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Blog Post Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        The blog post you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/blog"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          Browse all articles
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
} 