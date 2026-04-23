import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { useChallenge } from '@/contexts/ChallengeContext';

interface ShareBeforeAfterProps {
  beforePhoto: string | null;
  afterPhoto: string | null;
  onClose?: () => void;
}

export const ShareBeforeAfter: React.FC<ShareBeforeAfterProps> = ({
  beforePhoto,
  afterPhoto,
  onClose,
}) => {
  const { markAsShared } = useChallenge();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shareText = `🔥 I'm transforming with CallistheniX! 💪

Check out my before & after journey with the #1 calisthenics trainer app.

Join me: https://callisthenix.app

#CallistheniX #Fitness #Calisthenics #Transformation #BeforeAfter`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    markAsShared(whatsappUrl);
    setShared(true);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
    markAsShared(twitterUrl);
    setShared(true);
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
    markAsShared(facebookUrl);
    setShared(true);
  };

  const handleShareInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we copy to clipboard
    handleCopyLink();
    alert('Share text copied! Open Instagram and paste in your caption.');
    markAsShared('instagram');
    setShared(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg max-w-md w-full overflow-hidden border border-green-500">
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ background: 'oklch(0.15 0.006 285)' }}
        >
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: 'oklch(0.68 0.18 142)',
            }}
          >
            <Share2 size={20} /> SHARE YOUR TRANSFORMATION
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Share Text Preview */}
          <div
            className="p-4 rounded-lg"
            style={{
              background: 'oklch(0.15 0.006 285)',
              border: '1px solid oklch(0.68 0.18 142)',
            }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: 'oklch(0.90 0.008 80)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              {shareText}
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <p
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: 'oklch(0.65 0.01 285)',
                fontSize: '0.85rem',
              }}
            >
              SHARE ON:
            </p>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: '#25D366',
                color: '#fff',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              💬 WHATSAPP
            </button>

            {/* Twitter */}
            <button
              onClick={handleShareTwitter}
              className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: '#1DA1F2',
                color: '#fff',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              𝕏 TWITTER
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: '#1877F2',
                color: '#fff',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              f FACEBOOK
            </button>

            {/* Instagram */}
            <button
              onClick={handleShareInstagram}
              className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: '#fff',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              📷 INSTAGRAM
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: 'oklch(0.35 0.05 285)',
                color: 'oklch(0.90 0.008 80)',
                fontFamily: 'Barlow Condensed, sans-serif',
                border: '1px solid oklch(0.68 0.18 142)',
              }}
            >
              {copied ? (
                <>
                  <Check size={18} /> COPIED!
                </>
              ) : (
                <>
                  <Copy size={18} /> COPY TEXT
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {shared && (
            <div
              className="p-3 rounded-lg text-center"
              style={{
                background: 'oklch(0.15 0.006 285)',
                border: '1px solid oklch(0.68 0.18 142)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  color: 'oklch(0.68 0.18 142)',
                  fontSize: '0.9rem',
                }}
              >
                ✨ THANKS FOR SHARING! ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
