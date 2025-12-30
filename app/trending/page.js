// app/trending/page.js
import Link from 'next/link';

export default async function TrendingPage() {
  // Fetch data dari endpoint Rank (Populer)
  let dramas = [];
  try {
    const res = await fetch('https://restxdb.onrender.com/api/rank/1?lang=in&pagesize=50', { cache: 'no-store' });
    const result = await res.json();
    dramas = result?.data?.list || [];
  } catch (error) {
    console.error("Gagal ambil data trending:", error);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      
      {/* Header Halaman */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row items-end gap-4 border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-black flex items-center gap-3 text-red-600">
          <span className="text-5xl"></span> TOP 10
        </h1>
        <p className="text-gray-400 pb-2 text-lg">Drama paling banyak ditonton minggu ini</p>
      </div>

      {/* Grid Ranking */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6">
        {dramas.map((drama, index) => (
          <Link
            key={drama.bookId}
            href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}`}
          >
            <div className="group cursor-pointer relative">
              
              {/* Nomor Ranking Besar (#1, #2...) */}
              <div className="absolute -top-6 -left-4 z-10 w-16 h-16 flex items-center justify-center">
                 <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-600 drop-shadow-md italic">
                   {index + 1}
                 </span>
              </div>

              {/* Poster */}
              <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-gray-800 border-2 border-transparent group-hover:border-red-600 transition duration-300">
                <img
                  src={drama.cover}
                  alt={drama.bookName}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                
                {/* Badge Episode */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-bold rounded text-white border border-white/20">
                    {drama.chapterCount} Eps
                </div>
              </div>

              {/* Info Text */}
              <div className="mt-4 pl-2">
                <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-red-500 transition">
                  {drama.bookName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  <span className="text-xs text-gray-400 font-mono">
                    {drama.playCount ? drama.playCount.toLocaleString() : 'Popular'} Views
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}