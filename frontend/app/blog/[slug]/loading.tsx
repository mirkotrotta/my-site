import Loading from '@/components/ui/Loading'
import GlobalContainer from '@/components/ui/GlobalContainer'

export default function BlogLoading() {
  return (
    <div className="py-10">
      <GlobalContainer className="max-w-3xl mx-auto">
        <div className="w-2/3 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
        <div className="w-1/3 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-10 animate-pulse"></div>
        
        <div className="space-y-4">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <Loading message="Loading blog post..." />
      </GlobalContainer>
    </div>
  )
} 