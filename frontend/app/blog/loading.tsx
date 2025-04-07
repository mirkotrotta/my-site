export default function BlogIndexLoading() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="w-1/3 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-10 animate-pulse"></div>
      
      <ul className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="w-1/4 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-3 animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </li>
        ))}
      </ul>
    </section>
  )
} 