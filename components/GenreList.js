// components/GenreList.js
import Link from 'next/link';

const genres = [
  { name: "Romantis", query: "cinta" },
  { name: "CEO", query: "ceo" },
  { name: "Dendam", query: "dendam" },
  { name: "Kerajaan", query: "kerajaan" },
  { name: "Action", query: "aksi" },
  { name: "Keluarga", query: "keluarga" },
  { name: "Komedi", query: "lucu" },
  { name: "Misteri", query: "misteri" },
  { name: "Fantasi", query: "fantasi" }, // Tambahan biar barisnya agak panjang
  { name: "Horor", query: "hantu" },
];

export default function GenreList() {
  return (
    // WADAH UTAMA: Sticky + Full Width (w-full) + Glass Effect
    <div className="sticky top-16 z-40 w-full bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5 shadow-lg">
      
      {/* SCROLL AREA: Flex Container */}
      {/* justify-start di HP (biar bisa scroll), md:justify-center di Laptop (biar rapi di tengah) */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-3 px-6 py-4 w-max md:w-full md:justify-center">
          
          {genres.map((genre, index) => (
            <Link key={index} href={`/search/${genre.query}`}>
              <div className="whitespace-nowrap px-6 py-2 rounded-full bg-gray-800/50 border border-white/10 text-gray-300 text-sm font-medium hover:bg-red-600 hover:text-white hover:border-red-500 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95">
                {genre.name}
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}