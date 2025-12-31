import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import komponen Navbar
import Navbar from "@/components/Navbar";
import DynamicTitle from '@/components/DynamicTitle';

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
        
        {/* PERBAIKAN: Tambahkan pembungkus dengan padding-top agar konten tidak tertutup Navbar */}
        {/* pt-16 (64px) biasanya pas untuk tinggi navbar standar */}
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        
      </body>
    </html>
  );
}