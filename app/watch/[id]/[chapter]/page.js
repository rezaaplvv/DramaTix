// app/watch/[id]/[chapter]/page.js
import Player from "@/components/Player";
import Link from "next/link";
import HistorySaver from '@/components/HistorySaver'; 

// Helper Fetcher
async function getData(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    // Sansekai bisa return Array langsung atau Object { data: [...] }
    return Array.isArray(json) ? json : (json?.data || []);
  } catch (error) {
    console.error(`Error fetch ${url}:`, error);
    return [];
  }
}

export default async function WatchPage({ params, searchParams }) {
  const { id, chapter } = await params;
  const query = await searchParams; 

  // 1. FETCH DATA PARALEL (Episode & Rekomendasi)
  // Kita cukup ambil 'allepisode' karena di dalamnya sudah ada Link Video
  const [allEpisodes, recommendations] = await Promise.all([
    getData(`https://api.sansekai.my.id/api/dramabox/allepisode?bookId=${id}`),
    getData(`https://api.sansekai.my.id/api/dramabox/foryou`)
  ]);

  // 2. TENTUKAN EPISODE SAAT INI
  const currentEpIndex = parseInt(chapter); // Index dari URL (0, 1, 2...)
  const currentEpData = allEpisodes[currentEpIndex];

  // Jika episode tidak ditemukan (misal index kelebihan)
  if (!currentEpData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white pt-20">
        <h1 className="text-2xl font-bold mb-2">Video Tidak Tersedia</h1>
        <p className="text-gray-400">Mungkin episode ini belum rilis atau ada kesalahan sistem.</p>
        <Link href={`/drama/${id}`} className="mt-6 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition">
          Kembali ke Detail
        </Link>
      </div>
    );
  }

  // 3. AMBIL KUALITAS VIDEO (LOGIKA SANSEKAI)
  // Struktur: cdnList[0] -> videoPathList -> [{quality, videoPath}, ...]
  const videoSourceList = currentEpData.cdnList?.[0]?.videoPathList || [];
  
  // Mapping untuk Komponen Player
  const qualities = videoSourceList.map((q) => ({
    html: `${q.quality}P`, // Label di player (misal 720P)
    url: q.videoPath,      // Link video .mp4/.m3u8
    default: q.quality === 720 || q.quality === 1080, // Prioritas kualitas tinggi
  }));

  // Fallback jika tidak ada list kualitas, ambil langsung yg pertama
  const mainUrl = qualities.length > 0 
    ? qualities.find(q => q.default)?.url || qualities[0].url 
    : "";

  // 4. DATA UNTUK HISTORY & UI
  const dramaInfo = {
    bookId: id,
    bookName: query?.title ? decodeURIComponent(query.title) : "Sedang Memuat...",
    cover: query?.cover ? decodeURIComponent(query.cover) : "",
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-32 pb-10">
      
      {/* PENCATAT HISTORY */}
      <HistorySaver drama={dramaInfo} chapterIndex={chapter} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* === KOLOM KIRI (PLAYER AREA) === */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* WADAH PLAYER */}
          <div className="w-full h-[80vh] bg-black rounded-xl border border-gray-800 flex justify-center items-center relative shadow-2xl overflow-hidden">
            
            {/* COMPONENT PLAYER */}
            {mainUrl ? (
                <div className="h-full aspect-[9/16] w-auto relative bg-black shadow-lg">
                  <Player
                    option={{
                      url: mainUrl,
                      quality: qualities,
                      title: `Ep ${currentEpIndex + 1} - ${dramaInfo.bookName}`,
                      poster: dramaInfo.cover, 
                      autoSize: false, 
                      aspectRatio: true, 
                      fullscreen: true,
                      miniProgressBar: true,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
            ) : (
                <div className="text-gray-500">Link video rusak / tidak ditemukan.</div>
            )}

            {/* Tombol Back */}
            <Link href={`/drama/${id}`} className="absolute top-4 left-4 z-30 bg-gray-800/80 hover:bg-red-600 p-3 rounded-full transition text-white border border-white/10 shadow-lg group">
               <svg className="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
          </div>

          {/* INFO & NAVIGASI */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white line-clamp-1">
                  {dramaInfo.bookName}
                </h1>
                <div className="flex gap-3 text-sm text-gray-400 mt-1">
                   <span className="bg-red-600 text-white px-2 rounded text-xs font-bold flex items-center">HD</span>
                   <span>Episode {currentEpIndex + 1}</span>
                </div>
              </div>
              
              {/* Tombol Next / Prev */}
              <div className="flex gap-3 w-full md:w-auto">
                 <Link 
                   href={currentEpIndex > 0 ? `/watch/${id}/${currentEpIndex - 1}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}` : "#"} 
                   className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold bg-gray-800 hover:bg-gray-700 text-center transition ${currentEpIndex === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   Prev
                 </Link>
                 <Link 
                   href={currentEpIndex < allEpisodes.length - 1 ? `/watch/${id}/${currentEpIndex + 1}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}` : "#"} 
                   className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-center transition shadow-lg shadow-red-600/20 ${currentEpIndex >= allEpisodes.length - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   Next Episode &rarr;
                 </Link>
              </div>
          </div>

          {/* REKOMENDASI BAWAH PLAYER */}
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Lanjut Marathon</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {recommendations.slice(0, 10).map((drama) => (
                <Link 
                  key={drama.bookId} 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName || drama.title)}&cover=${encodeURIComponent(drama.coverWap || drama.cover)}`}
                  className="flex-shrink-0 w-32 md:w-40 group"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2 relative">
                      <img 
                        src={drama.coverWap || drama.cover || ""} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                         <div className="bg-red-600 p-1.5 rounded-full">
                           <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                         </div>
                      </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate group-hover:text-red-500 transition">
                    {drama.bookName || drama.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* === KOLOM KANAN (DAFTAR EPISODE) === */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[60vh] lg:h-[80vh] sticky top-32">
             <div className="p-4 bg-gray-800 border-b border-gray-700 shadow-md z-10">
                <h2 className="font-bold text-gray-200">Daftar Episode</h2>
                <p className="text-xs text-gray-500">Total {allEpisodes.length} Eps</p>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                {allEpisodes.map((chap, idx) => {
                  const isActive = idx === currentEpIndex;
                  return (
                    <Link 
                      key={chap.chapterId || idx}
                      href={`/watch/${id}/${idx}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}`}
                    >
                      <div className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-sm
                        ${isActive 
                          ? 'bg-red-600 text-white font-bold shadow-lg' 
                          : 'bg-gray-800/30 hover:bg-gray-700 text-gray-400 hover:text-gray-200'}
                      `}>
                          <div className="w-6 text-center">{isActive ? '▶' : idx + 1}</div>
                          <div className="truncate flex-1">
                             {chap.chapterName || `Episode ${idx + 1}`}
                          </div>
                          {chap.isCharge === 0 && (
                             <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">Free</span>
                          )}
                      </div>
                    </Link>
                  );
                })}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}