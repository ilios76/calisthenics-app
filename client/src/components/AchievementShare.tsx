// ============================================================
// CallistheniX – Achievement Sharing Component
// Share progress to Instagram/TikTok with watermark
// ============================================================
import { useState } from 'react';
import { Share2, Download, X, Instagram, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export interface Achievement {
  type: 'streak' | 'pr' | 'milestone' | 'level';
  title: string;
  value: string;
  icon: string;
  color: string;
}

interface AchievementShareProps {
  achievement: Achievement;
  userName: string;
}

export const AchievementShare = ({ achievement, userName }: AchievementShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareImage = async () => {
    setIsGenerating(true);
    try {
      // Create canvas for share image
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast.error('Failed to create image');
        return;
      }

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Green accent line
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 0, 1080, 20);

      // Achievement icon (large)
      ctx.font = 'bold 200px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(achievement.icon, 540, 400);

      // Achievement title
      ctx.font = 'bold 80px Barlow Condensed';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(achievement.title.toUpperCase(), 540, 600);

      // Achievement value
      ctx.font = 'bold 120px Bebas Neue';
      ctx.fillStyle = '#4ade80';
      ctx.fillText(achievement.value, 540, 800);

      // User name
      ctx.font = '60px DM Sans';
      ctx.fillStyle = '#b0b0b0';
      ctx.textAlign = 'center';
      ctx.fillText(`by ${userName}`, 540, 1100);

      // Motivational text
      ctx.font = '50px DM Sans';
      ctx.fillStyle = '#808080';
      ctx.fillText('Keep pushing your limits', 540, 1250);

      // CallistheniX branding (watermark)
      ctx.font = 'bold 60px Barlow Condensed';
      ctx.fillStyle = '#4ade80';
      ctx.textAlign = 'center';
      ctx.fillText('CALLISTHENIX', 540, 1750);

      ctx.font = '40px DM Sans';
      ctx.fillStyle = '#606060';
      ctx.fillText('Your Personal Calisthenics Trainer', 540, 1820);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `callisthenix-${achievement.type}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success('Image downloaded! Share it on Instagram or TikTok');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate share image');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToInstagram = () => {
    toast.info('Open the downloaded image in Instagram Stories or Feed');
    generateShareImage();
  };

  const shareToTikTok = () => {
    toast.info('Open the downloaded image in TikTok to create a video');
    generateShareImage();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
        style={{
          background: 'oklch(0.68 0.18 142)',
          color: 'oklch(0.10 0.005 285)',
        }}
      >
        <Share2 size={18} />
        Share Achievement
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full"
        style={{
          background: 'oklch(0.12 0.005 285)',
          border: '1px solid oklch(0.68 0.18 142 / 30%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: 'oklch(0.96 0.008 80)' }}
          >
            Share Your Achievement
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={24} style={{ color: 'oklch(0.70 0.008 80)' }} />
          </button>
        </div>

        {/* Preview */}
        <div
          className="mb-6 p-4 rounded-lg text-center"
          style={{
            background: 'oklch(0.14 0.006 285)',
            border: '1px solid oklch(1 0 0 / 10%)',
          }}
        >
          <div className="text-6xl mb-3">{achievement.icon}</div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: 'oklch(0.96 0.008 80)' }}
          >
            {achievement.title}
          </h3>
          <p style={{ color: 'oklch(0.68 0.18 142)', fontSize: '1.5rem' }}>
            {achievement.value}
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3 mb-6">
          {/* Instagram */}
          <button
            onClick={shareToInstagram}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: 'white',
            }}
          >
            <Instagram size={20} />
            {isGenerating ? 'Generating...' : 'Share to Instagram'}
          </button>

          {/* TikTok */}
          <button
            onClick={shareToTikTok}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: '#000000',
              color: 'white',
            }}
          >
            <Smartphone size={20} />
            {isGenerating ? 'Generating...' : 'Share to TikTok'}
          </button>

          {/* Download */}
          <button
            onClick={generateShareImage}
            disabled={isGenerating}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{
              background: 'oklch(0.68 0.18 142)',
              color: 'oklch(0.10 0.005 285)',
            }}
          >
            <Download size={20} />
            {isGenerating ? 'Generating...' : 'Download Image'}
          </button>
        </div>

        {/* Info */}
        <p
          style={{
            color: 'oklch(0.60 0.008 80)',
            fontSize: '0.85rem',
            textAlign: 'center',
          }}
        >
          Your achievement will be watermarked with CallistheniX branding. Share and inspire others! 💪
        </p>
      </div>
    </div>
  );
};
