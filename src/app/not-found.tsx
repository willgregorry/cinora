import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-16 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-2xl border border-[#1E293B] bg-[#101827] p-8 text-center">
          <p className="text-xs font-semibold tracking-widest text-[#22C55E] uppercase">
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#F8FAFC]">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
