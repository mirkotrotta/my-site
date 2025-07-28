import { Metadata } from 'next';
import Layout from '@/components/Layout';
import { getLegalContent } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const legalData = await getLegalContent('terms', 'en');
  return {
    title: legalData?.frontmatter.title || 'Terms of Service',
  };
}

export default async function TermsPage() {
  const legalData = await getLegalContent('terms', 'en');

  if (!legalData) {
    return (
      <Layout>
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-normal mb-4 text-gray-900 dark:text-white">Terms of Service</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Content not found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: legalData.htmlContent }} />
          </div>
        </div>
      </div>
    </Layout>
  );
} 