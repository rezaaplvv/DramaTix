export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white animate-pulse">
      
      {/* 1. SKELETON HERO */}
      {/* Kotak besar di atas untuk simulasi Banner Utama */}
      <div className="relative w-full aspect-[2/3] md:aspect-video bg-gray-800">
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-gray-900">
          <div className="h-8 bg-gray-700 rounded w-3/4 md:w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 md:w-1/3"></div>
          <div className="flex gap-3 mt-4">
             <div className="h-10 w-24 bg-red-900/50 rounded-full"></div>
             <div className="h-10 w-24 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 2. SKELETON GENRE LIST */}
      {/* Baris bulatan/kotak kecil untuk genre */}
      <div className="px-4 md:px-8 py-6">
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shrink-0 w-24 h-8 bg-gray-800 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
        
        {/* 3. SKELETON SECTION: Sedang Hype (Horizontal Scroll) */}
        <section>
          <div className="h-6 w-48 bg-gray-800 rounded mb-4"></div> {/* Judul Section */}
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shrink-0 w-[160px] aspect-[2/3] bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </section>

        {/* 4. SKELETON SECTION: Rekomendasi (Grid) */}
        <section>
          <div className="h-6 w-56 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}