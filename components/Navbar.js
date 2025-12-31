// components/Navbar.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (keyword.trim()) {
      router.push(`/search/${keyword}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. BAGIAN KIRI: LOGO */}
          <div className="flex-shrink-0 cursor-pointer min-w-max">
            <Link href="/">
              <span className="text-2xl font-black text-red-600 tracking-tighter">
                DRAMA<span className="text-white">TIX</span>
              </span>
            </Link>
          </div>

          {/* 2. BAGIAN TENGAH: MENU UTAMA (Desktop Only) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="text-white hover:text-red-500 px-3 py-2 rounded-md text-sm font-bold transition duration-300">
                Home
              </Link>
              <Link href="/mylist" className="text-white hover:text-red-500 px-3 py-2 rounded-md text-sm font-bold transition duration-300">
                My List
              </Link>
              <Link href="/trending" className="text-gray-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-bold transition duration-300">
                Trending
              </Link>
            </div>
          </div>

          {/* 3. BAGIAN KANAN: SEARCH + PROFILE */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-md ml-auto">
            
            {/* Search Input */}
            <form onSubmit={handleSearch} className="w-full relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Cari judul..." 
                className="w-full bg-gray-800/80 text-white px-4 py-2 pl-4 pr-10 rounded-full border border-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm placeholder-gray-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </form>
            
            {/* Search Icon (Mobile Only) */}
            <button className="sm:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* BARU: Profile Avatar (Sekarang BULAT) */}
            <div className="relative group cursor-pointer">
              {/* FIX: rounded diganti jadi rounded-full */}
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden border border-white/20">
                <span>R</span> 
              </div>
              
              {/* Dropdown Kecil */}
              <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-xl py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible border border-gray-800">
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="text-sm text-white font-bold">Halo, Reza!</p>
                  <p className="text-xs text-gray-400">VIP Member</p>
                </div>
                <Link href="/mylist" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  History Nonton
                </Link>
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  Pengaturan
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-800">
                  Keluar
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}