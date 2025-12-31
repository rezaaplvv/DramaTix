'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero({ dramas }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Pastikan data array ada
  const featuredDramas = dramas && dramas.length > 0 ? dramas : [];
  const drama = featuredDramas[currentIndex];

  useEffect(() => {
    if (featuredDramas.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 8000); 
    return () => clearInterval(interval);
  }, [currentIndex, featuredDramas.length]);

  useEffect(() => {
    if (!drama) return;
    const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
    const isSaved = savedList.some(item => item.bookId === drama.bookId);
    setIsBookmarked(isSaved);
  }, [drama]);

  const toggleBookmark = () => {
    const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
    if (isBookmarked) {
      const newList = savedList.filter(item => item.bookId !== drama.bookId);
      localStorage.setItem('myList', JSON.stringify(newList));
      setIsBookmarked(false);
    } else {
      const newItem = {
        bookId: drama.bookId,
        bookName: drama.bookName,
        cover: drama.cover,
        chapterCount: drama.chapterCount
      };
      localStorage.setItem('myList', JSON.stringify([...savedList, newItem]));
      setIsBookmarked(true);
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDramas.length);
      setFade(true);
    }, 500);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + featuredDramas.length) % featuredDramas.length);
      setFade(true);
    }, 500);
  };

  if (!drama) return null;

  return (
    // FIX 1: Ubah height jadi h-auto di mobile agar tidak terpotong, dan min-h-[85vh] biar tetap tinggi
    <div className="relative w-full min-h-[85vh] h-auto md:h-[85vh] overflow-hidden bg-gray-900 group">
      
      {/* BACKGROUND BLURRED */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <img 
          src={drama.cover} 
          alt="bg" 
          className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* KONTEN UTAMA */}
      {/* FIX 2: Gunakan flex-col-reverse agar di HP Gambar (elemen ke-2) naik ke atas Teks (elemen ke-1) */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-16 pt-24 pb-24">
        
        {/* BAGIAN KIRI (Desktop) / BAWAH (Mobile): TEXT */}
        <div className={`w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left transition-all duration-700 transform ${fade ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-600/20">
              TOP #{currentIndex + 1}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-gray-200 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
              {drama.chapterCount} Episode
            </span>
          </div>

          <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2">
            {drama.bookName}
          </h1>

          <p className="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-4 max-w-xl mx-auto md:mx-0 drop-shadow-md">
            {drama.introduction || "Saksikan drama seru ini sekarang juga..."}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2 md:pt-4">
            <Link 
              href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-red-600/30 text-sm md:text-base"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Mulai Nonton
            </Link>
            
            <button 
              onClick={toggleBookmark}
              className={`px-6 py-2.5 md:py-3 rounded-full font-semibold transition flex items-center gap-2 border text-sm md:text-base ${
                isBookmarked 
                  ? "bg-white text-red-600 border-white" 
                  : "bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md"
              }`}
            >
              {isBookmarked ? (
                <>
                   <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                   </svg>
                   <span>Tersimpan</span>
                </>
              ) : (
                <>
                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                   <span>My List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* BAGIAN KANAN (Desktop) / ATAS (Mobile): COVER BUKU */}
        {/* FIX 3: Hapus 'hidden', ganti width jadi responsif (kecil di HP, besar di Desktop) */}
        <div className={`w-[180px] md:w-[280px] lg:w-[340px] flex-shrink-0 relative transition-all duration-700 transform ${fade ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
           <div className="absolute -inset-2 bg-gradient-to-tr from-red-600 to-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
           <img 
            src={drama.cover} 
            alt={drama.bookName}
            className="relative w-full aspect-[3/4] object-cover rounded-xl shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition duration-500 ease-out"
          />
        </div>

      </div>

      {/* NAVIGASI PANAH */}
      <button 
        onClick={handlePrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-red-600 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition opacity-100 md:opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-red-600 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition opacity-100 md:opacity-0 group-hover:opacity-100 border border-white/10"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {featuredDramas.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
                setFade(false);
                setTimeout(() => { setCurrentIndex(idx); setFade(true); }, 500);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-red-600 w-6 md:w-8' : 'bg-white/40 w-2 hover:bg-white'
            }`}
          />
        ))}
      </div>

    </div>
  );
}