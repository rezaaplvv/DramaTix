// components/HistorySaver.js
'use client';

import { useEffect } from 'react';

export default function HistorySaver({ drama, chapterIndex }) {
  useEffect(() => {
    if (!drama || !drama.bookId) return;

    // 1. Ambil history lama
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');

    // 2. Buat data baru yang mau disimpan
    const newEntry = {
      bookId: drama.bookId,
      bookName: drama.bookName || drama.title,
      cover: drama.cover,
      chapterIndex: chapterIndex,
      savedAt: new Date().toISOString(),
    };

    // 3. Hapus data lama kalau film ini sudah pernah ditonton (biar gak duplikat)
    const filteredHistory = history.filter(item => item.bookId !== drama.bookId);

    // 4. Masukkan data baru ke paling depan (urutan 0)
    const newHistory = [newEntry, ...filteredHistory];

    // 5. Simpan balik ke LocalStorage
    localStorage.setItem('watchHistory', JSON.stringify(newHistory));
    
  }, [drama, chapterIndex]);

  return null; // Komponen ini invisible (tidak tampil di layar)
}