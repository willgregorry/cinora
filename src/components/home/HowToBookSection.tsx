const BOOKING_STEPS = [
  {
    step: "1",
    title: "Pilih Film",
    desktopDesc: "Temukan film favoritmu dan lihat detail ceritanya.",
    mobileDesc: "Lihat film dan detail ceritanya.",
  },
  {
    step: "2",
    title: "Tentukan Jadwal",
    desktopDesc: "Pilih tanggal, bioskop, dan jam tayang yang paling pas.",
    mobileDesc: "Pilih tanggal, bioskop, dan jam.",
  },
  {
    step: "3",
    title: "Pilih Kursi & Bayar",
    desktopDesc: "Pilih kursimu, lalu selesaikan pembayaran tiket.",
    mobileDesc: "Pilih kursi, lalu bayar tiket.",
  },
];

export function HowToBookSection() {
  return (
    <section id="cara-pesan" className="mt-16 mb-6 scroll-mt-24">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
          Cara Pesan Tiket
        </h2>
        <p className="mt-1.5 text-xs text-[#94A3B8] sm:text-sm">
          Dari pilih film sampai tiket siap, cukup tiga langkah.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {BOOKING_STEPS.map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-4 rounded-2xl border border-[#1E293B] bg-[#101827] p-5 text-left md:flex-col md:items-center md:p-7 md:text-center"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-base font-bold text-[#0B1120]">
              {item.step}
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
                <span className="md:hidden">{item.mobileDesc}</span>
                <span className="hidden md:inline">{item.desktopDesc}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
