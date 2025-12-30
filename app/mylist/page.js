// app/mylist/page.js
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyList() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Ambil data dari LocalStorage saat halaman dibuka
    const data = JSON.parse(localStorage.getItem('myWatchHistory') || '[]');
    setHistory(data);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span className="text-red-600"></span> Riwayat Tontonan
      </h1>

      {history.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {history.map((drama) => (
            <Link 
              key={drama.id} 
              // Saat diklik, langsung lanjut ke episode terakhir ditonton!
              href={`/watch/${drama.id}/${drama.chapter}?title=${encodeURIComponent(drama.title)}&cover=${encodeURIComponent(drama.cover)}`}
            >
              <div className="group cursor-pointer relative bg-gray-800 rounded-xl overflow-hidden">
                
                {/* Gambar Cover */}
                <div className="aspect-[2/3] relative">
                   <img 
                    src={drama.cover} 
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100"
                  />
                  {/* Icon Play Besar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600/80 p-3 rounded-full shadow-lg scale-0 group-hover:scale-100 transition">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Info Bawah */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-200 line-clamp-1">
                    {drama.title || "Tanpa Judul"}
                  </h3>
                  <p className="text-xs text-red-400 mt-1 font-bold">
                    Lanjut Episode {drama.chapter + 1}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(drama.lastWatched).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Belum ada riwayat nonton.</p>
          <Link href="/">
             <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full text-sm">Mulai Nonton</button>
          </Link>
        </div>
      )}
    </div>
  );
}