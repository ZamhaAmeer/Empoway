import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, place }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !place) return null;

  const url = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EMPOWAY – ${place.name}`,
          text: `Check accessibility details for ${place.name} in ${place.cityOrArea}, Colombo.`,
          url
        });
      } catch {
        // Share dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-empoway-blush shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-empoway-cream/70 border-b border-empoway-blush/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-empoway-terracotta/10 text-empoway-terracotta">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-empoway-coffee">
              Share Accessibility Profile
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-empoway-muted hover:text-empoway-coffee hover:bg-empoway-cream"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-empoway-muted leading-relaxed">
            Help friends, caregivers, and fellow travelers explore with confidence by sharing this accessibility record.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {navigator.share && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border border-empoway-champagne transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-empoway-terracotta" />
              <span>Share via Device Menu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

