// components/HistorySaver.js
"use client";
import { useEffect } from 'react';

export default function HistorySaver({ id, title, cover, chapter }) {
  useEffect(() => {
    // 1. Ambil data history lama
    const history = JSON.parse(localStorage.getItem('myWatchHistory') || '[]');
    
    // 2. Buat objek data baru
    const newEntry = {
      id,
      title: decodeURIComponent(title || ""),
      cover: decodeURIComponent(cover || ""),
      chapter: parseInt(chapter),
      lastWatched: new Date().toISOString() // Simpan waktu nonton
    };

    // 3. Hapus data lama film ini (biar gak duplikat)
    const filteredHistory = history.filter(item => item.id !== id);
    
    // 4. Masukkan data terbaru ke paling atas
    filteredHistory.unshift(newEntry);
    
    // 5. Simpan balik ke LocalStorage
    localStorage.setItem('myWatchHistory', JSON.stringify(filteredHistory));
    
  }, [id, chapter, title, cover]);

  return null; // Komponen ini tidak menampilkan apa-apa (invisible)
}