import React, { useState } from 'react';
import { X, Copy, Share2, MessageCircle, Mail } from 'lucide-react';

export interface ShareContent {
  title: string;
  description: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  emoji: string;
  achievement?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, content }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareText = (): string => {
    const stats = content.stats.map(s => `${s.label}: ${s.value}`).join(' • ');
    return `${content.emoji} ${content.title}\n\n${content.description}\n\n${stats}\n\nJoin me on CallistheniX! 💪`;
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      url: `https://wa.me/?text=${encodedText}`,
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      url: `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodedText}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'oklch(0 0 0 / 50%)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg p-8"
        style={{ background: 'oklch(0.12 0.005 285)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:opacity-70 transition-opacity"
        >
          <X size={24} style={{ color: 'oklch(0.65 0.01 285)' }} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{content.emoji}</div>
          <h2
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.96 0.008 80)',
              marginBottom: '8px',
            }}
          >
            {content.title}
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              color: 'oklch(0.65 0.01 285)',
            }}
          >
            {content.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {content.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 rounded text-center"
              style={{ background: 'oklch(0.15 0.006 285)' }}
            >
              <p
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1.5rem',
                  color: 'oklch(0.68 0.18 142)',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.7rem',
                  color: 'oklch(0.55 0.008 80)',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Share buttons */}
        <div className="space-y-3 mb-4">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
              }}
            >
              {link.icon}
              Share on {link.name}
            </a>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          style={{
            background: copied ? 'oklch(0.68 0.18 142 / 30%)' : 'oklch(0.20 0.005 285)',
            color: copied ? 'oklch(0.68 0.18 142)' : 'oklch(0.65 0.01 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            border: '1px solid oklch(0.68 0.18 142 / 30%)',
          }}
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  );
};
