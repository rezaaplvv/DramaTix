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
      <body>
        <DynamicTitle /> {/* 👈 2. PASANG DI SINI (Paling Atas) */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}