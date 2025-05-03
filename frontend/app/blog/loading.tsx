import { redirect } from 'next/navigation';

// This is a simple loading component for the non-internationalized blog route
// that redirects to the internationalized version
export default function BlogLoadingPage() {
  // Redirect to the default language blog route
  redirect('/en/blog');
  
  // This won't actually render, but is needed for TypeScript
  return null;
} 