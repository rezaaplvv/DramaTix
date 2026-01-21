'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import GenreList from '@/components/GenreList';
import Footer from '@/components/Footer';
import ContinueWatching from '@/components/ContinueWatching';

export default function Home() {
  // State Data
  const [heroData, setHeroData] = useState([]); 
  const [popular, setPopular] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  
  // State Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // --- HELPER FETCHER BARU (FIX MAPPING DATA) ---
        const getData = async (endpoint) => {
          try {
            // Fetch ke API Sansekai
            const res = await fetch(`https://api.sansekai.my.id/api/dramabox/${endpoint}`);
            
            if (!res.ok) throw new Error('Fetch error');
            const json = await res.json();
            
            // Cek apakah response berupa Array langsung atau Object data
            const rawData = Array.isArray(json) ? json : (json?.data || []);

            // MAPPING DATA SUPER LENGKAP
            return rawData.map(item => ({
              bookId: item.bookId,
              bookName: item.bookName || item.title, // Judul Drama
              
              // FIX UTAMA: Cek 'coverWap' (W besar), 'bookCover' (Random), dan 'cover' (Search)
              cover: item.coverWap || item.bookCover || item.cover || "", 
              
              chapterCount: item.chapterCount || 0, // Jumlah Episode
              introduction: item.introduction || "" // Sinopsis
            }));

          } catch (err) {
            console.error(`Gagal ambil ${endpoint}`, err);
            return [];
          }
        };

        // --- AMBIL DATA DARI ENDPOINT SANSEKAI YANG MAS KIRIM ---
        //
        const [resNew, resRec, resPop] = await Promise.all([
          getData('latest'),                              // Baru Diupdate (Screenshot 1749)
          getData('foryou'),                              // Rekomendasi/Hero (Screenshot 1748)
          getData('dubindo?classify=terpopuler&page=1')   // Sedang Hype (Screenshot 1746)
        ]);

        setNewReleases(resNew);
        setRecommendations(resRec);
        setPopular(resPop);
        
        // LOGIC HERO: Ambil 5 data teratas dari 'For You' untuk Slider
        const slides = resRec.slice(0, 5);
        if (slides.length > 0) {
           setHeroData(slides);
        } else if (resNew.length > 0) {
           setHeroData(resNew.slice(0, 5));
        }

      } catch (error) {
        console.error("Error utama:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Memuat Drama Dramatix...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* 1. HERO SECTION */}
      {heroData.length > 0 && <Hero dramas={heroData} />}
      
      {/* 2. CONTINUE WATCHING */}
      <div className="relative z-20"> 
          <ContinueWatching />
      </div>

      <GenreList />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* POPULER / SEDANG HYPE */}
        {popular.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full"></span>
              Sedang Hype
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
              {popular.map((drama) => (
                <Link 
                  key={drama.bookId} 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction)}`}
                  className="snap-start shrink-0 w-[160px]"
                >
                  <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-red-500 transition">
                    <img src={drama.cover} alt={drama.bookName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">TOP</div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-300 line-clamp-1 group-hover:text-white">{drama.bookName}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* REKOMENDASI SPESIAL */}
        {recommendations.length > 0 && (
          <section id="rekomendasi" className="scroll-mt-24">
            <div className="pt-4 mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Rekomendasi Spesial
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.slice(0, 10).map((drama) => (
                <Link 
                  key={drama.bookId} 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction)}`}
                >
                  <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 cursor-pointer">
                    <img src={drama.cover} alt={drama.bookName} className="w-full h-full object-cover transition group-hover:opacity-80" loading="lazy" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BARU DIUPDATE */}
        {newReleases.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Baru Diupdate
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {newReleases.map((drama) => (
                <Link 
                  key={drama.bookId} 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction)}`}
                >
                  <div className="group cursor-pointer relative">
                    <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-gray-800">
                      <img src={drama.cover} alt={drama.bookName} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-bold rounded text-white border border-white/20">
                        {drama.chapterCount} Eps
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-200 text-sm line-clamp-1 group-hover:text-red-500 transition">{drama.bookName}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        
      </div>
      <Footer />
    </main>
  );
}