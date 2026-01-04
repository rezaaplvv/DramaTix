import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import komponen pendukung
import Navbar from "@/components/Navbar";
import DynamicTitle from '@/components/DynamicTitle';
import DonateBtn from "@/components/DonateBtn"; // 👈 Tambahkan ini

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Ubah judul tab browser di sini
  title: "DramaTix - Nonton Drama Terbaru",
  description: "Web streaming drama terbaik dan terlengkap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DynamicTitle /> 
        <Navbar />
        
        {/* Konten utama dengan padding agar tidak tertutup navbar */}
        <main className="pt-16 md:pt-20">
          {children}
        </main>

        {/* 2. Tombol Donasi Fixed di pojok kanan bawah */}
        <DonateBtn />
        
      </body>
    </html>
  );
}