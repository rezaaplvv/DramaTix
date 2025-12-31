// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10">
        {/* Angka Besar */}
        <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-black leading-none select-none">
          404
        </h1>

        {/* Pesan Lucu */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4 animate-bounce">
          Waduh! Salah Kamar Bos... 🎬
        </h2>
        
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          Halaman yang kamu cari sepertinya sudah "tamat" atau memang tidak pernah diproduksi.
        </p>

        {/* Tombol Balik */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-red-600/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Home
        </Link>
      </div>

    </div>
  );
}