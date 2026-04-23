import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { useChallenge } from '@/contexts/ChallengeContext';

interface SelfieCaptureProps {
  mode: 'before' | 'after';
  onCapture?: (photo: string) => void;
  onClose?: () => void;
}

export const SelfieCapture: React.FC<SelfieCaptureProps> = ({ mode, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setBeforePhoto, setAfterPhoto } = useChallenge();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Unable to access camera. Please check permissions.');
        console.error('Camera access error:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(photoData);
      }
    }
  };

  const handleConfirm = () => {
    if (photo) {
      if (mode === 'before') {
        setBeforePhoto(photo);
      } else {
        setAfterPhoto(photo);
      }
      onCapture?.(photo);
      onClose?.();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = event.target?.result as string;
        setPhoto(photoData);
      };
      reader.readAsDataURL(file);
    }
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
            className="text-lg font-bold"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: 'oklch(0.68 0.18 142)',
            }}
          >
            {mode === 'before' ? 'TAKE BEFORE PHOTO' : 'TAKE AFTER PHOTO'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
          </button>
        </div>

        {/* Camera or Photo Preview */}
        <div className="relative bg-black aspect-square overflow-hidden">
          {!photo ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </>
          ) : (
            <img src={photo} alt="Captured" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4" style={{ background: 'oklch(0.15 0.006 285)' }}>
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 flex gap-3" style={{ background: 'oklch(0.15 0.006 285)' }}>
          {!photo ? (
            <>
              <button
                onClick={capturePhoto}
                className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-105"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                }}
              >
                <Camera size={18} /> CAPTURE
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 rounded-lg font-bold transition-all hover:scale-105"
                style={{
                  background: 'oklch(0.35 0.05 285)',
                  color: 'oklch(0.90 0.008 80)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                UPLOAD
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          ) : (
            <>
              <button
                onClick={() => setPhoto(null)}
                className="flex-1 py-2 rounded-lg font-bold transition-all hover:scale-105"
                style={{
                  background: 'oklch(0.35 0.05 285)',
                  color: 'oklch(0.90 0.008 80)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                RETAKE
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-105"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                }}
              >
                <Check size={18} /> CONFIRM
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
