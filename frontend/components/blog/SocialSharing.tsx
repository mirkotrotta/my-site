"use client";

import { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { IoLogoTwitter, IoLogoFacebook, IoLogoLinkedin, IoShareSocial, IoLinkOutline } from "react-icons/io5";
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
    setFullUrl(url.startsWith('http') ? url : `${window.location.origin}${url}`);
    setCanUseNativeShare(!!navigator.share);
  }, [url]);
  
  const handleNativeShare = async () => {
    if (!canUseNativeShare) return;
    
    try {
      await navigator.share({
        title,
        text: summary,
        url: fullUrl,
      });
      trackSocialShare('native');
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
          <TwitterShareButton
            url={fullUrl}
            title={title}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="Share on Twitter"
            onClick={() => isClient && trackSocialShare('twitter')}
          >
            <IoLogoTwitter size={20} className="text-gray-700 dark:text-gray-300" />
          </TwitterShareButton>
          <FacebookShareButton
            url={fullUrl}
            quote={title}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="Share on Facebook"
            onClick={() => isClient && trackSocialShare('facebook')}
          >
            <IoLogoFacebook size={20} className="text-gray-700 dark:text-gray-300" />
          </FacebookShareButton>
          <LinkedinShareButton
            url={fullUrl}
            title={title}
            summary={summary}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="Share on LinkedIn"
            onClick={() => isClient && trackSocialShare('linkedin')}
          >
            <IoLogoLinkedin size={20} className="text-gray-700 dark:text-gray-300" />
          </LinkedinShareButton>
          {/* Native share button */}
          {isClient && canUseNativeShare && (
            <button
              onClick={handleNativeShare}
              aria-label="Share via device"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <IoShareSocial size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}
          {/* Copy link button */}
          <button
            onClick={copyToClipboard}
            aria-label="Copy link"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors relative"
          >
            <IoLinkOutline size={20} className="text-gray-700 dark:text-gray-300" />
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 