// components/Player.js
"use client";

import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function Player({ option, style, getInstance, ...rest }) {
  const artRef = useRef();      // Referensi ke elemen DIV
  const playerRef = useRef(null); // Referensi ke Instance Player (Penjaga)

  useEffect(() => {
    // 1. CEK PENJAGA: Kalau player sudah ada, jangan bikin lagi!
    if (playerRef.current) {
      return;
    }

    // 2. BERSIHKAN WADAH: Pastikan div kosong sebelum diisi player
    if (artRef.current) {
        artRef.current.innerHTML = "";
    }

    // 3. INIT PLAYER BARU
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      // Settingan default yang mantap
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: false, // Kita atur size via CSS container
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

    // Simpan player ke penjaga
    playerRef.current = art;

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    // 4. CLEANUP: Hancurkan player saat pindah halaman
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy(false);
        playerRef.current = null; // Reset penjaga
      }
    };
  }, []); // Dependency array kosong = jalan sekali saat mount

  return <div ref={artRef} style={style} {...rest}></div>;
}