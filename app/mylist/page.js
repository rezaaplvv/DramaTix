'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer'; 

export default function MyListPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Ambil data dari LocalStorage saat halaman dibuka
  useEffect(() => {
    setMounted(true);
    const data = JSON.parse(localStorage.getItem('myList') || '[]');
    setBookmarks(data);
  }, []);

  // Fungsi Hapus Film dari List
  const handleRemove = (id) => {
    const newData = bookmarks.filter(item => item.bookId !== id);
    setBookmarks(newData);
    localStorage.setItem('myList', JSON.stringify(newData));
    
    // Trigger event agar komponen lain tahu ada perubahan
    window.dispatchEvent(new Event("storage"));
  };

  if (!mounted) return null; 

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      
      {/* Padding top diperbesar agar tidak tertutup Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full flex-grow">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-1 h-8 bg-red-600 rounded-full"></span> Daftar Tontonan Saya
          </h1>
          <span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            {bookmarks.length} Film Tersimpan
          </span>
        </div>

        {/* LOGIKA JIKA LIST KOSONG */}
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-800 p-6 rounded-full mb-4 animate-pulse">
              <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-300">Belum ada drama favorit?</h2>
            <p className="text-gray-500 mt-2 mb-6">Yuk cari drama seru dan simpan di sini biar gak lupa!</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition shadow-lg shadow-red-900/20">
              Cari Drama
            </Link>
          </div>
        ) : (
          /* GRID CARD DRAMA */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {bookmarks.map((drama) => (
              <div key={drama.bookId} className="group relative">
                
                <Link 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}`}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 relative shadow-lg group-hover:ring-2 group-hover:ring-red-600 transition">
                    <img 
                      src={drama.cover} 
                      alt={drama.bookName} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay Play Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="bg-red-600 p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition duration-300">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="mt-3 text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-red-500 transition">
                    {drama.bookName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {drama.chapterCount ? `${drama.chapterCount} Episode` : 'Episode Belum Tersedia'}
                  </p>
                </Link>

                {/* Tombol Hapus (X) */}
                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleRemove(drama.bookId);
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 shadow-md"
                  title="Hapus dari list"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}