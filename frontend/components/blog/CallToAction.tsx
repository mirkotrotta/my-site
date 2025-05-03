import GlobalCTA from '@/components/ui/GlobalCTA';
import useTranslation from '@/hooks/useTranslation';

export default function CallToAction() {
  const { language, t } = useTranslation();
  
  return (
    <GlobalCTA
      title={t('blog.newsletter.title') || "Stay Updated"}
      subtitle={t('blog.newsletter.subtitle') || "Subscribe to our newsletter to get the latest articles, news, and updates directly in your inbox."}
      buttonText={t('blog.newsletter.button') || "Subscribe Now"}
      buttonHref={`/${language}/newsletter`}
      className="mt-8 md:mt-12 border-t"
    />
  );
} 