import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n.config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const { legal } = await getDictionary(lang);
  return {
    title: legal.legal_notice.title,
  };
}

export default async function LegalNoticePage({ params: { lang } }: { params: { lang: Locale } }) {
  const { legal } = await getDictionary(lang);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>{legal.legal_notice.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: legal.legal_notice_content.replace(/\\n/g, '<br />') }} />
    </div>
  );
} 