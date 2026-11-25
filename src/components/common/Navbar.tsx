"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { CinoraLogo } from "./CinoraLogo";
import { ModalBackdrop } from "./ModalBackdrop";

const NAV_ITEMS = [
  {
    href: "/#film",
    label: "Film",
    desc: "Sedang tayang dan akan datang",
  },
  {
    href: "/#film",
    label: "Jadwal",
    desc: "Jadwal tayang dan tiket",
  },
  {
    href: "/#cara-pesan",
    label: "Cara Pesan",
    desc: "Panduan pemesanan tiket",
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-40 h-20 border-b border-[#1E293B] bg-[#0B1120]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
            aria-label="CINORA Beranda"
          >
            <CinoraLogo />
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-8 text-sm font-medium text-[#CBD5E1] md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[#F8FAFC]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/#film"
              className="inline-flex items-center justify-center rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#0B1120] transition hover:bg-white sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Pesan Tiket
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#334155] bg-[#101827] text-[#F8FAFC] transition hover:border-[#475569] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <ModalBackdrop
        open={menuOpen}
        label="Menu navigasi"
        onClose={closeMenu}
        className="items-start p-4 pt-6 md:hidden"
      >
        <div className="w-full max-w-[350px] rounded-2xl border border-[#1E293B] bg-[#101827] p-5 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xl font-bold text-[#F8FAFC]">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Tutup menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0B1120] text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3.5 transition hover:border-[#334155]"
              >
                <div>
                  <p className="text-base font-semibold text-[#F8FAFC]">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
              </Link>
            ))}
          </div>
        </div>
      </ModalBackdrop>
    </>
  );
}
