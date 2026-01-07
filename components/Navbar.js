// components/Navbar.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [keyword, setKeyword] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); 
  
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const [isSearching, setIsSearching] = useState(false); 

  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const baseClass = "px-2 md:px-3 py-1.5 rounded-full text-[11px] md:text-sm font-bold transition duration-300 whitespace-nowrap";
    return pathname === path 
      ? `${baseClass} text-white bg-red-600 shadow-lg shadow-red-900/20` 
      : `${baseClass} text-gray-300 hover:text-white hover:bg-white/10`;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 
      ${scrolled || showMobileSearch ? 'bg-black/95 backdrop-blur-md' : 'bg-black/40 backdrop-blur-md'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-1 md:gap-4">
          
          {/* 1. KIRI: LOGO (Dibuat shrink-0 agar tidak mengecil) */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl md:text-2xl font-black text-red-600 tracking-tighter block">
                DRAMA<span className="text-white">TIX</span>
              </span>
            </Link>
          </div>

          {/* 2. TENGAH: MENU (flex-grow untuk ambil sisa ruang) */}
          <div className="flex-grow flex justify-center overflow-hidden">
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/5">
              <Link href="/" className={getLinkClass('/')}>Home</Link>
              <Link href="/mylist" className={getLinkClass('/mylist')}>My List</Link>
              <Link href="/trending" className={getLinkClass('/trending')}>Trending</Link>
            </div>
          </div>

          {/* 3. KANAN: SEARCH (shrink-0 dan justify-end agar tetap di pojok) */}
          <div className="flex-shrink-0 flex justify-end min-w-[40px]">
            
            {/* SEARCH DESKTOP */}
            <div ref={searchRef} className="relative hidden sm:block w-[180px] md:w-[240px]">
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Cari..." 
                  className="w-full bg-gray-900/50 text-white px-4 py-1.5 pr-10 rounded-full border border-white/10 focus:outline-none focus:border-red-500 transition text-sm"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => keyword.length >= 3 && setShowSuggestions(true)}
                />
                <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </button>
              </form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 right-0 w-[280px] bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <div className="py-2">
                    {suggestions.map((drama) => (
                      <Link 
                        key={drama.bookId}
                        href={`/drama/${drama.bookId}?title=${encodeURIComponent(drama.bookName)}&cover=${encodeURIComponent(drama.cover)}&synopsis=${encodeURIComponent(drama.introduction || "")}`}
                        onClick={() => setShowSuggestions(false)}
                        className="px-4 py-2 hover:bg-white/5 flex gap-3 items-center"
                      >
                         <img src={drama.cover} className="w-8 h-10 object-cover rounded" />
                         <p className="text-sm font-medium text-gray-200 truncate">{drama.bookName}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* TOMBOL SEARCH MOBILE */}
            <button 
              className="sm:hidden text-white p-2 hover:bg-white/10 rounded-full transition"
              onClick={() => setShowMobileSearch(!showMobileSearch)} 
            >
              {showMobileSearch ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {showMobileSearch && (
          <div className="sm:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Cari drama..." 
                className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-red-500 outline-none"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}