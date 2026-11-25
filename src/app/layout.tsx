import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CINORA — Pemesanan Tiket Bioskop",
  description:
    "Temukan film favoritmu, pilih jadwal dan kursi, lalu selesaikan pembayaran tiket bioskop dengan cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-screen bg-[#0B1120] text-[#F8FAFC] font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
