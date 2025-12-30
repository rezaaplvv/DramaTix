import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import komponen Navbar
import Navbar from "@/components/Navbar";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        {/* 2. Pasang Navbar di sini (sebelum children) */}
        <Navbar />
        
        {/* Ini adalah konten halaman (Home, Detail, dll) */}
        {children}
      </body>
    </html>
  );
}