"use client";

import { useState, useEffect } from 'react';
import { SiX, SiFacebook, SiLinkedin } from "react-icons/si";
import { Share, Link2 } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { trackSocialShare } from '@/components/analytics/ShareTracker';

type SocialSharingProps = {
  url: string;
  title: string;
  summary?: string;
  className?: string;
};

/**
 * SocialSharing component provides buttons to share content on social media
 * and also displays the author's social links
 */
export default function SocialSharing({ url, title, summary = "", className = "" }: SocialSharingProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [fullUrl, setFullUrl] = useState(url);
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  
  // Safely initialize client-side values after mount
  useEffect(() => {
    setIsClient(true);
    setFullUrl(`${window.location.origin}${url}`);
    setCanUseNativeShare(!!navigator.share);
  }, [url]);
  
  // Encode components for sharing URLs - only use encoded values on client
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);
  
  // Generate sharing URLs
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
  
  const handleNativeShare = async () => {
    if (!canUseNativeShare) return;
    
    try {
      await navigator.share({
        title,
        text: summary,
        url: fullUrl,
      });
      // trackSocialShare is called automatically via the ShareTracker override
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      trackSocialShare('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-6">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 font-medium">
          Share This Article
        </h4>
        <div className="flex space-x-4">
          {/* Render the same UI structure on both server and client */}
          {!isClient || !canUseNativeShare ? (
            <>
              <a 
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => isClient && trackSocialShare('twitter')}
              >
                <SiX size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => isClient && trackSocialShare('facebook')}
              >
                <SiFacebook size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => isClient && trackSocialShare('linkedin')}
              >
                <SiLinkedin size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
            </>
          ) : (
            <button
              onClick={handleNativeShare}
              aria-label="Share"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Share size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
          <button
            onClick={copyToClipboard}
            aria-label="Copy link"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors relative"
          >
            <Link2 size={20} className="text-gray-700 dark:text-gray-300" />
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 font-medium">
          Connect With Us
        </h4>
        <SocialLinks className="justify-start" />
      </div>
    </div>
  );
} 