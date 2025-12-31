// components/ShareBtn.js
'use client';

import { useState } from 'react';

export default function ShareBtn({ title, text }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href; 

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Batal membagikan', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Gagal copy', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 bg-gray-800 hover:bg-gray-700 text-white border border-white/20 hover:border-white/50 active:scale-95"
    >
      {copied ? (
        <>
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="leading-none pt-[2px]">Tersalin!</span>
        </>
      ) : (
        <>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {/* PERBAIKAN DISINI: leading-none dan pt-[2px] */}
          <span className="leading-none pt-[2px]">Share</span>
        </>
      )}
    </button>
  );
}