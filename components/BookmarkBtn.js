// components/BookmarkBtn.js
'use client'; // Wajib karena ada interaksi klik

import { useState, useEffect } from 'react';

export default function BookmarkBtn({ drama }) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. Cek status saat pertama kali load
  useEffect(() => {
    setMounted(true); // Menandakan komponen sudah di-render di browser
    const bookmarks = JSON.parse(localStorage.getItem('myList') || '[]');
    const exists = bookmarks.find(item => item.bookId === drama.bookId);
    if (exists) setIsSaved(true);
  }, [drama.bookId]);

  // 2. Fungsi saat tombol diklik
  const handleToggle = () => {
    // Ambil data lama
    let bookmarks = JSON.parse(localStorage.getItem('myList') || '[]');
    
    if (isSaved) {
      // Kalau sudah ada, HAPUS (Un-bookmark)
      bookmarks = bookmarks.filter(item => item.bookId !== drama.bookId);
      setIsSaved(false);
      // alert("Dihapus dari My List ❌"); // Opsional: Debugging
    } else {
      // Kalau belum ada, TAMBAH (Save)
      // Kita cuma simpan data penting aja biar ringan
      const dramaToSave = {
        bookId: drama.bookId,
        bookName: drama.bookName || drama.title, // Handle beda nama properti
        cover: drama.cover,
        chapterCount: drama.chapterCount || '??',
        savedAt: new Date().toISOString()
      };
      bookmarks.push(dramaToSave);
      setIsSaved(true);
      // alert("Disimpan ke My List ❤️"); // Opsional: Debugging
    }

    // Simpan balik ke LocalStorage
    localStorage.setItem('myList', JSON.stringify(bookmarks));
    
    // Trik: Dispatch event custom biar navbar (kalau ada counter) bisa update real-time
    window.dispatchEvent(new Event("storage"));
  };

  // Jangan render apa-apa sebelum mounted (menghindari error Hydration)
  if (!mounted) return <div className="w-10 h-10"></div>;

  return (
    <button 
      onClick={handleToggle}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95
        ${isSaved 
          ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'}
      `}
    >
      {/* Ikon Jantung (Heart Icon) */}
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
      
      <span>{isSaved ? 'Tersimpan' : 'My List'}</span>
    </button>
  );
}