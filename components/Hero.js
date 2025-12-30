import Link from 'next/link';

export default function Hero({ drama }) {
  if (!drama) return null;

  const title = encodeURIComponent(drama.bookName);
  const cover = encodeURIComponent(drama.cover);
  // Encode sinopsis (jaga-jaga kalau kosong kasih string kosong)
  const synopsis = encodeURIComponent(drama.introduction || ""); 

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh]">
      
      {/* 1. GAMBAR BACKGROUND */}
      <div className="absolute inset-0">
        <img 
          src={drama.cover} 
          alt={drama.bookName} 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* 2. KONTEN TEKS & TOMBOL */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        
        <span className="text-red-500 font-bold tracking-wider text-sm mb-2">
          TRENDING SEKARANG
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg max-w-2xl">
          {drama.bookName}
        </h1>

        <p className="text-gray-200 text-sm md:text-lg mb-6 max-w-xl line-clamp-3 drop-shadow-md">
          {drama.introduction || "Saksikan keseruan drama terbaru ini dengan kualitas HD."}
        </p>

        <div className="flex gap-4">
          {/* FIX: Tambahkan &synopsis=${synopsis} di link */}
          <Link href={`/drama/${drama.bookId}?title=${title}&cover=${cover}&synopsis=${synopsis}`}>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              Mulai Nonton
            </button>
          </Link>
          
          <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold backdrop-blur-sm transition">
            + Daftar Saya
          </button>
        </div>

      </div>
    </div>
  );
}