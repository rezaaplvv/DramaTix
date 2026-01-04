// components/DonateBtn.js
'use client';

import React from 'react';

export default function DonateBtn() {
  return (
    <a 
      href="https://sociabuzz.com/zeronaut/tribe" // 👈 GANTI dengan link Sociabuzz kamu
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] group flex items-center gap-2"
    >
      {/* Label Teks (Muncul saat Hover di Desktop, selalu muncul di HP) */}
      <span className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/20">
        <svg 
          className="w-4 h-4" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Donate Me
      </span>
    </a>
  );
}