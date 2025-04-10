'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import GlobalContainer from '@/components/ui/GlobalContainer'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Blog post error:', error)
  }, [error])

  return (
    <div className="py-20">
      <GlobalContainer className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <svg 
            className="w-16 h-16 text-red-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Something went wrong!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't load this blog post. Please try again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Try again
            </button>
            <Link
              href="/blog"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition"
            >
              Back to blog
            </Link>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Error details:</h2>
            <p className="font-mono text-sm overflow-x-auto">
              {error?.message || 'Unknown error occurred'}
            </p>
            {error?.digest && (
              <p className="font-mono text-sm mt-2 text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </GlobalContainer>
    </div>
  )
} 