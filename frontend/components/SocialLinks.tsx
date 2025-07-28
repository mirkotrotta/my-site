"use client";

import { ReactNode } from 'react';
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiFacebook } from 'react-icons/si';
import { Mail } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  variant?: 'vertical' | 'horizontal';
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  className?: string;
}

const defaultLinks: SocialLink[] = [
  { platform: 'linkedin', url: 'https://linkedin.com/in/mirkotrotta' },
  { platform: 'github', url: 'https://github.com/mirkotrotta' },
  { platform: 'x', url: 'https://x.com/mirkotrotta' },
  { platform: 'email', url: 'mailto:hello@mirkotrotta.com' },
];

export function SocialIcon({ 
  platform, 
  url, 
  size = 'medium' 
}: { 
  platform: string, 
  url: string, 
  size?: 'small' | 'medium' | 'large' 
}) {
  let iconSize: number;
  
  switch (size) {
    case 'small':
      iconSize = 16;
      break;
    case 'large':
      iconSize = 28;
      break;
    case 'medium':
    default:
      iconSize = 22;
      break;
  }

  const iconClass = "text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-white transition-colors duration-200";
  let icon: ReactNode;
  let label: string = platform.charAt(0).toUpperCase() + platform.slice(1);
    
  switch (platform.toLowerCase()) {
    case 'linkedin':
      icon = <SiLinkedin size={iconSize} className={iconClass} />;
      break;
    case 'github':
      icon = <SiGithub size={iconSize} className={iconClass} />;
      break;
    case 'twitter':
    case 'x':
      icon = <SiX size={iconSize} className={iconClass} />;
      break;
    case 'instagram':
      icon = <SiInstagram size={iconSize} className={iconClass} />;
      break;
    case 'facebook':
      icon = <SiFacebook size={iconSize} className={iconClass} />;
      break;
    case 'email':
      icon = <Mail size={iconSize} className={iconClass} />;
      label = 'Email';
      break;
    default:
      return null;
  }
  
  return (
    <a 
      href={url} 
      target={platform.toLowerCase() === 'email' ? '_self' : '_blank'} 
      rel="noopener noreferrer" 
      aria-label={label}
      className="inline-flex items-center"
    >
      {icon}
    </a>
  );
}

export default function SocialLinks({ 
  links, 
  variant = 'horizontal', 
  size = 'medium', 
  showLabels = false,
  className = '' 
}: SocialLinksProps) {
  const { t } = useTranslation();
  const resolvedLinks = (links === undefined) ? defaultLinks : links;
  if (!resolvedLinks || resolvedLinks.length === 0) {
    return null;
  }
  
  const containerClass = variant === 'vertical' 
    ? 'flex flex-col space-y-4' 
    : 'flex space-x-5';
  
  return (
    <div className={`${containerClass} ${className}`}>
      {resolvedLinks.map((link, index) => (
        <div key={index} className={showLabels ? 'flex items-center' : ''}>
          <SocialIcon platform={link.platform} url={link.url} size={size} />
          
          {showLabels && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {link.platform === 'email' 
                ? t('social.email') 
                : t(`social.${link.platform.toLowerCase()}`)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
