// components/BookmarkBtn.js
'use client'; 

import { useState, useEffect } from 'react';

export default function BookmarkBtn({ drama }) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
    const bookmarks = JSON.parse(localStorage.getItem('myList') || '[]');
    const exists = bookmarks.find(item => item.bookId === drama.bookId);
    if (exists) setIsSaved(true);
  }, [drama.bookId]);

  const handleToggle = () => {
    let bookmarks = JSON.parse(localStorage.getItem('myList') || '[]');
    if (isSaved) {
      bookmarks = bookmarks.filter(item => item.bookId !== drama.bookId);
      setIsSaved(false);
    } else {
      const dramaToSave = {
        bookId: drama.bookId,
        bookName: drama.bookName || drama.title, 
        cover: drama.cover,
        chapterCount: drama.chapterCount || '??',
        savedAt: new Date().toISOString()
      };
      bookmarks.push(dramaToSave);
      setIsSaved(true);
    }
    localStorage.setItem('myList', JSON.stringify(bookmarks));
    window.dispatchEvent(new Event("storage"));
  };

  if (!mounted) return <div className="w-full h-12 bg-gray-800 rounded-full animate-pulse"></div>;

  return (
    <button 
      onClick={handleToggle}
      className={`
        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95
        ${isSaved 
          ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'}
      `}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isSaved ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        className={`w-6 h-6 ${isSaved ? 'animate-bounce-short' : ''}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      
      {/* PERBAIKAN DISINI: leading-none dan pt-[2px] */}
      <span className="leading-none pt-[2px]">{isSaved ? 'Tersimpan' : 'My List'}</span>
    </button>
  );
}