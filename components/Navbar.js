// components/Navbar.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // STATE
  const [keyword, setKeyword] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); 
  
  // STATE AUTOCOMPLETE
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const [isSearching, setIsSearching] = useState(false); 

  const searchRef = useRef(null);

  // 1. Efek Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. LOGIKA LIVE SEARCH
  useEffect(() => {
    if (keyword.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://restxdb.onrender.com/api/search/${keyword}/1?lang=in`;
        const res = await fetch(url);
        const json = await res.json();
        const results = json?.data?.list || [];
        setSuggestions(results.slice(0, 5)); 
        setShowSuggestions(true);
      } catch (error) {
        console.error("Gagal live search:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (keyword.trim()) {
      setShowSuggestions(false); 
      setShowMobileSearch(false); 
      router.push(`/search/${keyword}`);
    }
  };

  const getLinkClass = (path) => {
    const baseClass = "px-2 md:px-3 py-2 rounded-md text-[12px] md:text-sm font-bold transition duration-300 whitespace-nowrap";
    return pathname === path 
      ? `${baseClass} text-white bg-white/10` 
      : `${baseClass} text-gray-300 hover:text-red-500 hover:bg-white/5`;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 
      ${scrolled || showMobileSearch ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black/50 backdrop-blur-md'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. KIRI: LOGO */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="min-w-max">
              <span className="text-xl md:text-2xl font-black text-red-600 tracking-tighter hover:scale-105 transition transform block">
                DRAMA<span className="text-white">TIX</span>
              </span>
            </Link>
          </div>

          {/* 2. TENGAH: MENU UTAMA (Desktop & Mobile) */}
          <div className="flex-[2] flex justify-center items-center">
            <div className="flex items-center space-x-1 md:space-x-4 bg-white/5 p-1 rounded-full border border-white/10">
              <Link href="/" className={getLinkClass('/')}>Home</Link>
              <Link href="/mylist" className={getLinkClass('/mylist')}>My List</Link>
              <Link href="/trending" className={getLinkClass('/trending')}>Trending</Link>
            </div>
          </div>

          {/* 3. KANAN: SEARCH SAJA (Profil Dihapus) */}
          <div className="flex-1 flex justify-end items-center">
            
            {/* SEARCH DESKTOP */}
            <div ref={searchRef} className="relative hidden sm:block w-full max-w-[240px]">
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Cari drama..." 
                  className="w-full bg-gray-800/80 text-white px-4 py-1.5 pl-4 pr-10 rounded-full border border-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm placeholder-gray-500"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => keyword.length >= 3 && setShowSuggestions(true)}
                />
                <div className="absolute right-3 top-1.5 text-gray-400">
                   {isSearching ? (
                     <svg className="animate-spin h-5 w-5 text-red-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   ) : (
                     <button type="submit" className="hover:text-white transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                     </button>
                   )}
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-[300px] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="py-2">
                    {suggestions.map((drama) => (
                      <Link 
                        key={drama.bookId}
                        href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="px-4 py-2 hover:bg-gray-800 flex gap-3 items-center cursor-pointer transition">
                           <img src={drama.cover} alt={drama.bookName} className="w-8 h-11 object-cover rounded bg-gray-700" />
                           <p className="text-sm font-bold text-gray-200 truncate">{drama.bookName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* TOMBOL SEARCH MOBILE */}
            <button 
              className="sm:hidden text-white hover:text-red-500 transition p-2 bg-white/5 rounded-full"
              onClick={() => setShowMobileSearch(!showMobileSearch)} 
            >
              {showMobileSearch ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>

          </div>
        </div>

        {/* MOBILE SEARCH BAR EXPAND */}
        {showMobileSearch && (
          <div className="sm:hidden px-2 pb-4 pt-2 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Cari drama..." 
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-red-500 outline-none shadow-inner"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </form>
            
            {suggestions.length > 0 && keyword.length >= 3 && (
               <div className="mt-2 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                 {suggestions.map((drama) => (
                    <Link 
                      key={drama.bookId}
                      href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
                      onClick={() => setShowMobileSearch(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-800 hover:bg-gray-800 flex items-center gap-3">
                         <img src={drama.cover} className="w-8 h-11 object-cover rounded bg-gray-800" alt="" />
                         <span className="text-sm font-bold text-gray-200 line-clamp-1">{drama.bookName}</span>
                      </div>
                    </Link>
                 ))}
               </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}