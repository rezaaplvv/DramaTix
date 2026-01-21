"use client";

import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function Player({ option, style, getInstance, ...rest }) {
  const artRef = useRef(null);
  const playerInstanceRef = useRef(null); // Ref untuk menyimpan instance Artplayer

  // 1. Efek untuk Inisialisasi dan Hancurkan Player
  useEffect(() => {
    // Pengecekan ini mencegah inisialisasi ulang di React StrictMode atau HMR.
    // Player hanya dibuat jika instance-nya belum ada.
    if (!playerInstanceRef.current) {
      const art = new Artplayer({
      ...option,
      container: artRef.current,
      // Settingan Default
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#E50914",
      
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
    });
      
      // Simpan instance ke dalam ref
      playerInstanceRef.current = art;
      
      if (getInstance && typeof getInstance === "function") {
        getInstance(art);
      }
    }

    // Fungsi cleanup: Dipanggil saat komponen di-unmount.
    return () => {
      if (playerInstanceRef.current && playerInstanceRef.current.destroy) {
        playerInstanceRef.current.destroy(false);
        // Penting: Set ref ke null setelah dihancurkan agar bisa dibuat ulang jika perlu.
        playerInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency kosong memastikan ini hanya berjalan saat mount dan unmount.


  // 2. Efek untuk menangani pembaruan (misalnya, ganti episode)
  useEffect(() => {
    const player = playerInstanceRef.current;

    // Cek apakah instance player ada dan URL disediakan
    if (player && option.url) {
      // Jika URL berubah, ganti sumber video
      if (player.url !== option.url) {
        console.log("Mengganti video ke:", option.url);
        player.switchUrl(option.url, option.title);
      }

      // Selalu update properti lain yang mungkin berubah antar episode
      player.poster = option.poster;
      player.title = option.title;
    }
  }, [option.url, option.poster, option.title]); // Efek ini berjalan saat properti ini berubah

  return <div ref={artRef} style={style} {...rest}></div>;
}