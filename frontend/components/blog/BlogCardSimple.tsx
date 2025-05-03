import { PostData } from '@/lib/mdx';
import Button from '@/components/ui/Button';

type BlogCardSimpleProps = {
    post: PostData;
    lang?: string;
};

export default function BlogCardSimple({ post, lang = 'en' }: BlogCardSimpleProps) {
    return (
        <article className="group flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden transition-all duration-200 mb-2">
            <Button 
                variant="link" 
                className="flex flex-col items-start pl-0" 
                href={`/${lang}/blog/${post.slug}`} 
                showArrow
            >
                <span className="text-lg text-blue-600 dark:text-blue-400 hover:underline transition-colors line-clamp-2 mb-2">
                    {post.frontmatter.title}
                </span>
            </Button>
        </article>
    );
}
