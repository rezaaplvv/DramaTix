// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Kolom 1: Brand */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-black text-red-600 mb-4">
            DRAMA<span className="text-white">TIX</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Platform streaming drama pendek vertikal terbaik dan terlengkap. 
            Nikmati ribuan episode seru secara gratis dengan kualitas HD.
          </p>
        </div>

        {/* Kolom 2: Link */}
        <div>
          <h3 className="text-white font-bold mb-4">Jelajahi</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-red-500 cursor-pointer">Trending</li>
            <li className="hover:text-red-500 cursor-pointer">Rekomendasi</li>
            <li className="hover:text-red-500 cursor-pointer">Paling Baru</li>
            <li className="hover:text-red-500 cursor-pointer">Genre</li>
          </ul>
        </div>

        {/* Kolom 3: Bantuan */}
        <div>
          <h3 className="text-white font-bold mb-4">Bantuan</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-red-500 cursor-pointer">FAQ</li>
            <li className="hover:text-red-500 cursor-pointer">Kontak Kami</li>
            <li className="hover:text-red-500 cursor-pointer">DMCA</li>
            <li className="hover:text-red-500 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
        
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-900 text-center text-xs">
        &copy; 2025 DramaTix.
      </div>
    </footer>
  );
}