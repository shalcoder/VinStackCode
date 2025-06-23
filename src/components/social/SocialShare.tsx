import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Link, Copy, Check } from 'lucide-react';
import Button from '../ui/Button';

interface SocialShareProps {
  snippet: {
    id: string;
    title: string;
    description: string;
    language: string;
    author: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/snippet/${snippet.id}`;
  const shareText = `Check out this ${snippet.language} snippet: "${snippet.title}" by ${snippet.author} on VinStackCode`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=coding,snippets,VinStackCode`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: snippet.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNativeShare}
        className="flex items-center space-x-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4"
        >
          <div className="space-y-3">
            <h4 className="font-medium text-white">Share this snippet</h4>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTwitterShare}
                className="w-full justify-start"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="w-full justify-start"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Direct link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="p-1"
                >
                  <Link className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SocialShare;