"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 py-16 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-2xl border border-[#7A271A] bg-[#101827] p-8 text-center">
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            Terjadi kesalahan tak terduga
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            {error.message || "Gagal memuat halaman CINORA."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#0B1120] px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#475569]"
            >
              <ArrowLeft className="h-4 w-4" />
              Beranda
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
