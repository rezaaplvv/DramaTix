import Link from 'next/link';
import Hero from '@/components/Hero';
import GenreList from '@/components/GenreList';
import Footer from '@/components/Footer';

async function getData(endpoint) {
  try {
    const res = await fetch(`https://restxdb.onrender.com/api/${endpoint}?lang=in`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data?.list || [];
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const [newReleases, recommendations, popular] = await Promise.all([
    getData('new/1?pagesize=20'),
    getData('foryou/1'),
    getData('rank/1')
  ]);

  const featuredDrama = recommendations[0] || newReleases[0]; 

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Hero drama={featuredDrama} />
      <GenreList />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* POPULER */}
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
                  // FIX: Bawa Sinopsis
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
                  className="snap-start shrink-0 w-[160px]"
                >
                  <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-red-500 transition">
                    <img src={drama.cover} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">TOP</div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-300 line-clamp-1 group-hover:text-white">{drama.bookName}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* REKOMENDASI */}
        {recommendations.length > 0 && (
           <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Rekomendasi Spesial
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.slice(0, 10).map((drama) => (
                <Link 
                  key={drama.bookId} 
                  // FIX: Bawa Sinopsis
                  href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
                >
                  <div className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 cursor-pointer">
                    <img src={drama.cover} className="w-full h-full object-cover transition group-hover:opacity-80" />
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

        {/* TERBARU */}
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
                // FIX: Bawa Sinopsis
                href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
              >
                <div className="group cursor-pointer relative">
                  <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-gray-800">
                    <img 
                      src={drama.cover} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-bold rounded text-white border border-white/20">
                      {drama.chapterCount} Eps
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-200 text-sm line-clamp-1 group-hover:text-red-500 transition">
                      {drama.bookName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{drama.playCount || 'N/A'} Views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}