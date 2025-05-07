// Type fixes for Next.js
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

// Fix for the PageParams vs PageProps error
declare global {
  interface PageParams extends Params {
    slug: string;
  }
  
  interface PageProps {
    params: PageParams;
  }
}

export {}; 