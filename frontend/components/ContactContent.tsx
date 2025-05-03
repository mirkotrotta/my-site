'use client';

import Layout from '@/components/Layout';
import ContactForm from '@/components/forms/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import useTranslation from '@/hooks/useTranslation';

interface ContactContentProps {
  language: 'en' | 'de';
}

export default function ContactContent({ language }: ContactContentProps) {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-normal mb-4 text-gray-900 dark:text-white">{t('contact.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t('contact.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8">
              <h2 className="text-2xl font-normal mb-4 text-gray-900 dark:text-white">{t('contact.connect.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('contact.connect.subtitle')}
              </p>
              
              <div className="mb-6">
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">{t('contact.connect.email')}</h3>
                <a 
                  href="mailto:hello@mirkotrotta.com" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  hello@mirkotrotta.com
                </a>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">{t('contact.connect.social')}</h3>
                <SocialLinks className="justify-start" />
              </div>
              
              <div>
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">{t('contact.connect.response')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('contact.connect.responseTime')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('contact.privacy')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 