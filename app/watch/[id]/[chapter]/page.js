// app/watch/[id]/[chapter]/page.js
import Player from "@/components/Player";
import Link from "next/link";
import HistorySaver from '@/components/HistorySaver'; // ✅ IMPORT KOMPONEN PENCATAT

async function getData(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    return json?.data;
  } catch (error) {
    return null;
  }
}

export default async function WatchPage({ params, searchParams }) {
  const { id, chapter } = await params;
  const query = await searchParams; 

  // Ambil data Video, Daftar Chapter, dan Rekomendasi secara paralel biar cepat
  const [videoData, chapterData, recommendationData] = await Promise.all([
    getData(`https://restxdb.onrender.com/api/watch/${id}/${chapter}?lang=in`),
    getData(`https://restxdb.onrender.com/api/chapters/${id}?lang=in`),
    getData(`https://restxdb.onrender.com/api/foryou/1?lang=in`)
  ]);

  if (!videoData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white pt-20">
        <h1 className="text-2xl font-bold">Video Tidak Tersedia 😢</h1>
        <Link href={`/drama/${id}`} className="mt-4 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition">
          Kembali
        </Link>
      </div>
    );
  }

  // Siapkan data kualitas video
  const qualities = videoData.qualities?.map((q) => ({
    html: `${q.quality}P`,
    url: q.videoPath,
    default: q.quality === 720, // Default 720p biar tajam
  })) || [];
  const mainUrl = qualities.length > 0 ? qualities[0].url : videoData.videoUrl;

  const chapters = chapterData?.chapterList || [];
  const currentEpIndex = parseInt(chapter);

  // ✅ SIAPKAN DATA UNTUK HISTORY SAVER
  const dramaInfo = {
    bookId: id,
    bookName: query?.title ? decodeURIComponent(query.title) : "Drama Tanpa Judul",
    cover: query?.cover ? decodeURIComponent(query.cover) : "",
  };

  return (
    // 'pt-32' supaya Video TIDAK KETABRAK Navbar di atas
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-32 pb-10">
      
      {/* 👇 PENCATAT HISTORY DIPASANG DISINI 👇 */}
      <HistorySaver drama={dramaInfo} chapterIndex={chapter} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* KOLOM KIRI (PLAYER AREA) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* WADAH CINEMA (STAGE) */}
          <div className="w-full h-[80vh] bg-black rounded-xl border border-gray-800 flex justify-center items-center relative shadow-2xl overflow-hidden">
            
            {/* PLAYER VERTIKAL (UKURAN HP) */}
            <div className="h-full aspect-[9/16] w-auto relative bg-black shadow-lg">
              <Player
                option={{
                  url: mainUrl,
                  quality: qualities,
                  title: dramaInfo.bookName, // Pakai nama dari dramaInfo
                  poster: dramaInfo.cover,   // Pakai cover dari dramaInfo
                  autoSize: false, 
                  aspectRatio: true, 
                  fullscreen: true,
                  miniProgressBar: true,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Tombol Back */}
            <Link href={`/drama/${id}`} className="absolute top-4 left-4 z-30 bg-gray-800/80 hover:bg-red-600 p-3 rounded-full transition text-white border border-white/10 shadow-lg">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>

          </div>

          {/* INFO JUDUL & NAVIGASI BAWAH */}
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
              
              {/* Tombol Next Prev */}
              <div className="flex gap-3 w-full md:w-auto">
                 <Link 
                   href={`/watch/${id}/${currentEpIndex - 1}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}`} 
                   className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold bg-gray-800 hover:bg-gray-700 text-center transition ${currentEpIndex === 0 ? 'hidden' : ''}`}
                 >
                   Prev
                 </Link>
                 <Link 
                   href={`/watch/${id}/${currentEpIndex + 1}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}`} 
                   className="flex-1 md:flex-none px-6 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-center transition shadow-lg shadow-red-600/20"
                 >
                   Next Episode &rarr;
                 </Link>
              </div>
          </div>

          {/* REKOMENDASI BAWAH */}
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Lanjut Marathon</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {recommendationData?.list?.slice(0, 10).map((drama) => (
                <Link 
                  key={drama.bookId} 
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}`}
                  className="flex-shrink-0 w-32 md:w-40 group"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2 relative">
                     <img src={drama.cover} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                     {/* Overlay Play Icon Kecil */}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <div className="bg-red-600 p-1.5 rounded-full">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                     </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate group-hover:text-red-500 transition">{drama.bookName}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (SIDEBAR EPISODE) */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[60vh] lg:h-[80vh] sticky top-32">
             <div className="p-4 bg-gray-800 border-b border-gray-700 shadow-md z-10">
                <h2 className="font-bold text-gray-200">Daftar Episode</h2>
                <p className="text-xs text-gray-500">Total {chapters.length} Eps</p>
             </div>
             <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                {chapters.map((chap, idx) => {
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
                          <div className="truncate flex-1">Episode {idx + 1}</div>
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