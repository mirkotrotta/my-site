import Link from 'next/link';
import { PostData } from '@/lib/mdx';
import { ArrowRight } from '@carbon/icons-react';

type BlogCardSimpleProps = {
    post: PostData;
};

export default function BlogCardSimple({ post }: BlogCardSimpleProps) {
    return (
        <article className="group flex flex-col h-full border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 mb-2">
            <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col flex-grow p-4">
                    <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors line-clamp-2">
                        {post.frontmatter.title}
                    </h3>
                </div>
            </Link>
        </article>
    );
}
