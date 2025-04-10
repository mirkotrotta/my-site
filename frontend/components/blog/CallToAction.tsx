import GlobalCTA from '@/components/ui/GlobalCTA';

export default function CallToAction() {
  return (
    <GlobalCTA
      title="Stay Updated"
      subtitle="Subscribe to our newsletter to get the latest articles, news, and updates directly in your inbox."
      buttonText="Subscribe Now"
      buttonHref="/newsletter"
      className="mt-8 md:mt-12 border-t"
    />
  );
} 