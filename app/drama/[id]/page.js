import Link from 'next/link';
import BookmarkBtn from '@/components/BookmarkBtn'; 
import ShareBtn from '@/components/ShareBtn';

export default async function DramaDetail({ params, searchParams }) {
  // Await params dan searchParams (Next.js 15)
  const { id } = await params;
  const query = await searchParams;

  // Data Default (Fallback dari URL jika API lambat)
  let dramaInfo = {
    bookId: id,
    bookName: query?.title ? decodeURIComponent(query.title) : "Memuat Judul...",
    cover: query?.cover ? decodeURIComponent(query.cover) : "https://via.placeholder.com/300x450",
    introduction: query?.synopsis ? decodeURIComponent(query.synopsis) : "Memuat sinopsis...",
  };

  let chapters = [];

  try {
    // 1. FETCH DATA DARI SANSEKAI API (Parallel Request biar cepat)
    const [detailRes, episodeRes] = await Promise.all([
      fetch(`https://api.sansekai.my.id/api/dramabox/detail?bookId=${id}`, { cache: 'no-store' }),
      fetch(`https://api.sansekai.my.id/api/dramabox/allepisode?bookId=${id}`, { cache: 'no-store' })
    ]);

    const detailJson = await detailRes.json();
    const episodeJson = await episodeRes.json();

    // 2. OLAH DATA DETAIL
    // Sansekai kadang mengembalikan object langsung atau dibungkus 'data'
    const detailData = detailJson?.data || detailJson;
    
    // UPDATE dramaInfo dengan data asli dari API
    if (detailData) {
        dramaInfo = {
            bookId: id,
            bookName: detailData.bookName || detailData.title || dramaInfo.bookName,
            // FIX UTAMA: Gunakan coverWap (API baru) jika ada
            cover: detailData.coverWap || detailData.cover || dramaInfo.cover, 
            introduction: detailData.introduction || "Sinopsis tidak tersedia untuk drama ini.",
        };
    }

    // 3. OLAH DATA EPISODE
    // API Episode mengembalikan Array langsung
    const rawEpisodes = Array.isArray(episodeJson) ? episodeJson : (episodeJson?.data || []);
    chapters = rawEpisodes;

  } catch (error) {
    console.error("Gagal ambil data drama:", error);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* HEADER BACKGROUND */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img 
          src={dramaInfo.cover} 
          alt={dramaInfo.bookName} 
          className="w-full h-full object-cover blur-lg opacity-50 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-80 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* KOLOM KIRI: POSTER & TOMBOL */}
          <div className="flex-shrink-0 w-48 md:w-72 mx-auto md:mx-0">
            {/* Poster */}
            <div className="rounded-lg shadow-2xl border-4 border-gray-800 overflow-hidden bg-black aspect-[2/3]">
               <img 
                 src={dramaInfo.cover} 
                 alt={dramaInfo.bookName} 
                 className="w-full h-full object-cover"
               />
            </div>
            
            {/* AREA TOMBOL AKSI */}
            <div className="mt-4 space-y-3">
                {/* 1. Tombol Mulai Nonton */}
                {chapters.length > 0 && (
                  <Link href={`/watch/${id}/0?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}`}>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      Mulai Nonton
                    </button>
                  </Link>
                )}

                {/* 2. Baris Tombol Sekunder (My List & Share) */}
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                    {/* Tombol Kiri (Tersimpan) */}
                    <div className="w-full">
                        <BookmarkBtn 
                            drama={{
                                bookId: id,
                                bookName: dramaInfo.bookName,
                                cover: dramaInfo.cover,
                                chapterCount: chapters.length
                            }} 
                        />
                    </div>

                    {/* Tombol Kanan (Share) */}
                    <div className="w-full">
                        <ShareBtn 
                            title={`Nonton ${dramaInfo.bookName} di DramaTix!`} 
                            text={`Drama seru nih: ${dramaInfo.bookName}. Nonton yuk!`} 
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* KOLOM KANAN: DETAIL INFO */}
          <div className="flex-1 text-center md:text-left pt-4">
            <h1 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-md leading-tight">
              {dramaInfo.bookName}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
                 Drama
               </span>
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
                 {chapters.length} Episode
               </span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 max-w-3xl">
              {dramaInfo.introduction}
            </p>

            {/* DAFTAR EPISODE */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Daftar Episode</h3>
              {chapters.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {chapters.map((chapter, index) => (
                      <Link 
                        key={chapter.chapterID || index} 
                        href={`/watch/${id}/${index}?title=${encodeURIComponent(dramaInfo.bookName)}&cover=${encodeURIComponent(dramaInfo.cover)}`}
                      >
                        <div className="bg-gray-700 hover:bg-red-600 rounded-lg p-3 text-center cursor-pointer transition border border-transparent hover:border-red-400">
                          <span className="text-sm font-bold text-gray-300">{index + 1}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
              ) : (
                  <p className="text-gray-500 italic">Belum ada episode yang tersedia.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}