// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* KOLOM 1: BRAND */}
        <div className="col-span-1 md:col-span-2">
           <h2 className="text-3xl font-black text-red-600 mb-6 tracking-tighter">
             DRAMA<span className="text-white">TIX</span>
           </h2>
           <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
             Platform streaming drama pendek vertikal terbaik dan terlengkap. 
             Nikmati ribuan episode seru secara gratis dengan kualitas HD.
           </p>
        </div>

        {/* KOLOM 2: JELAJAHI */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Jelajahi</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link href="/trending" className="hover:text-red-600 transition block w-fit">
                Trending
              </Link>
            </li>
            <li>
              {/* UPDATE DISINI: Tambahkan /#rekomendasi */}
              <Link href="/#rekomendasi" className="hover:text-red-600 transition block w-fit">
                Rekomendasi
              </Link>
            </li>
            <li>
              <Link href="/search/new" className="hover:text-red-600 transition block w-fit">
                Paling Baru
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-red-600 transition block w-fit">
                Genre
              </Link>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: BANTUAN */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Bantuan</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link href="/faq" className="hover:text-red-600 transition block w-fit">
                FAQ
              </Link>
            </li>
            <li>
              <a href="mailto:support@dramatix.com" className="hover:text-red-600 transition block w-fit">
                Kontak Kami
              </a>
            </li>
            <li>
              <Link href="/dmca" className="hover:text-red-600 transition block w-fit">
                DMCA
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-red-600 transition block w-fit">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-600 text-xs border-t border-gray-900 pt-8">
        &copy; {new Date().getFullYear()} DramaTix. All rights reserved. • Dibuat dengan 🔥 oleh Reza
      </div>
    </footer>
  );
}