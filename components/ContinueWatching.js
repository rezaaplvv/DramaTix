// components/ContinueWatching.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContinueWatching() {
  const [lastWatched, setLastWatched] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ambil history dari LocalStorage
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    
    // Ambil item pertama (yang paling baru ditonton)
    if (history.length > 0) {
      setLastWatched(history[0]);
    }
  }, []);

  // Jangan tampilkan apa-apa kalau belum ada history
  if (!mounted || !lastWatched) return null;

  return (
    // PERBAIKAN DISINI:
    // -mt-20: Di HP dia naik ke atas (floating di atas cover)
    // md:mt-0: Di Laptop/Desktop dia turun ke posisi normal (supaya tidak nabrak teks)
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:mt-0 relative z-20 mb-8">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-xl backdrop-blur-md">
        
        {/* Poster Kecil */}
        <div className="shrink-0 w-16 h-24 bg-black rounded-lg overflow-hidden relative shadow-md">
          <img 
            src={lastWatched.cover} 
            alt={lastWatched.bookName}
            className="w-full h-full object-cover"
          />
          {/* Tombol Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
             <div className="bg-red-600 rounded-full p-1">
               <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
             </div>
          </div>
        </div>

        {/* Info Teks */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-red-400 font-bold uppercase mb-1 tracking-wider">
            Lanjutkan Menonton
          </p>
          <h3 className="text-lg font-bold text-white truncate leading-tight">
            {lastWatched.bookName}
          </h3>
          <p className="text-sm text-gray-400">
            Episode {parseInt(lastWatched.chapterIndex) + 1}
          </p>
        </div>

        {/* Tombol Aksi (Desktop Only) */}
        <Link 
          href={`/watch/${lastWatched.bookId}/${lastWatched.chapterIndex}?title=${encodeURIComponent(lastWatched.bookName)}&cover=${encodeURIComponent(lastWatched.cover)}`}
          className="hidden sm:flex shrink-0 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-bold text-sm transition items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          Putar
        </Link>

        {/* Area Klik Mobile (Invisible Link menutupi seluruh card) */}
        <Link 
           href={`/watch/${lastWatched.bookId}/${lastWatched.chapterIndex}?title=${encodeURIComponent(lastWatched.bookName)}&cover=${encodeURIComponent(lastWatched.cover)}`}
           className="absolute inset-0 sm:hidden"
        />

      </div>
    </div>
  );
}