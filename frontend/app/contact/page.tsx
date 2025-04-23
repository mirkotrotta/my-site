import Layout from '@/components/Layout';
import ContactForm from '@/components/forms/ContactForm';
import { Metadata } from 'next';
import SocialLinks from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'Contact Me | Mirko Trotta',
  description: 'Get in touch with me for project inquiries, collaboration opportunities, or just to connect.',
};

export default function ContactPage() {
  return (
    <Layout>
      <div className="py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-normal mb-4 text-gray-900 dark:text-white">Get in Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Have a question or want to work together? Feel free to reach out using the form below
            or through my social media channels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8">
              <h2 className="text-2xl font-normal mb-4 text-gray-900 dark:text-white">Connect Directly</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Prefer to connect through other channels? Reach out via social media or email.
              </p>
              
              <div className="mb-6">
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">Email</h3>
                <a 
                  href="mailto:hello@mirkotrotta.com" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  hello@mirkotrotta.com
                </a>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">Social Media</h3>
                <SocialLinks className="justify-start" />
              </div>
              
              <div>
                <h3 className="text-md font-normal mb-2 text-gray-800 dark:text-gray-200">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  I typically respond within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your privacy matters. Information submitted through this form is only used to respond to your inquiry and will not be shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 