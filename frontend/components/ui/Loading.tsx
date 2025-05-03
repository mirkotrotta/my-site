'use client'

import React from 'react'

export interface LoadingProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export default function Loading({ 
  message = 'Loading content...', 
  fullPage = false,
  className = ''
}: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'min-h-screen' : 'py-20'} ${className}`}>
      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  )
} 