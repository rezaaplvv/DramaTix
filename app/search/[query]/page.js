// app/search/[query]/page.js
import Link from 'next/link';

export default async function SearchPage({ params }) {
  // 1. Ambil query dari URL (sesuai nama folder [query])
  const { query } = await params; 
  
  // Decode biar spasi terbaca (misal "Cinta%20Suci" jadi "Cinta Suci")
  const decodedQuery = decodeURIComponent(query);

  let dramas = [];
  
  try {
    // 2. FETCH DATA DARI SANSEKAI API
    const res = await fetch(
      `https://api.sansekai.my.id/api/dramabox/search?query=${query}`, 
      { cache: 'no-store' }
    );
    
    // API Search Sansekai mengembalikan array langsung
    const json = await res.json();
    const rawData = Array.isArray(json) ? json : (json?.data || []);

    // 3. MAPPING DATA (PENTING)
    // Agar variabel 'cover', 'bookName' sesuai dengan UI kodingan mas
    dramas = rawData.map(item => ({
      bookId: item.bookId,
      bookName: item.bookName || item.title,
      // Cek semua kemungkinan nama variabel gambar dari API
      cover: item.cover || item.coverWap || item.bookCover || "https://via.placeholder.com/300x450", 
      chapterCount: item.chapterCount || 0,
      introduction: item.introduction || ""
    }));

    // Cek di terminal VS Code untuk debug
    console.log(`Mencari: ${decodedQuery}, Ditemukan: ${dramas.length}`);
    
  } catch (error) {
    console.error("Error search:", error);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      
      {/* Header Halaman */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold">
          Hasil Pencarian: <span className="text-red-500">"{decodedQuery}"</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Ditemukan {dramas.length} judul
        </p>
      </div>

      {/* Logic Tampilan */}
      {dramas.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {dramas.map((drama) => (
            <Link 
              key={drama.bookId} 
              href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction)}`}
            >
              <div className="group cursor-pointer relative">
                
                {/* Poster Image */}
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[2/3] bg-gray-800">
                  <img 
                    src={drama.cover} 
                    alt={drama.bookName}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  {/* Badge Episode */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 text-xs font-bold rounded text-white border border-white/20">
                    {drama.chapterCount ? `${drama.chapterCount} Eps` : 'Promo'}
                  </div>
                </div>

                {/* Judul */}
                <h3 className="mt-3 text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-red-500 transition">
                  {drama.bookName}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Tampilan Kalau Kosong
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-300">
            Tidak ada drama yang ditemukan
          </h2>
          <p className="text-gray-500 mt-2">
            Coba cari kata kunci lain seperti "CEO", "Cinta", atau "Dendam"
          </p>
        </div>
      )}
    </div>
  );
}