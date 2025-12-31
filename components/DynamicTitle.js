// components/DynamicTitle.js
'use client';

import { useEffect } from 'react';

export default function DynamicTitle() {
  useEffect(() => {
    // Simpan judul asli
    const originalTitle = document.title;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Kalau user pindah tab, ganti judulnya
        document.title = "Jangan pergi dong...";
      } else {
        // Kalau user balik lagi, kembalikan judul asli
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null; // Komponen ini gak nampilin apa-apa di layar
}