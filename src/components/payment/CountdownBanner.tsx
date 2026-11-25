import { formatCountdown } from "@/lib/format";

interface CountdownBannerProps {
  isConfirmed: boolean;
  isExpired: boolean;
  remainingMs: number;
}

export function CountdownBanner({
  isConfirmed,
  isExpired,
  remainingMs,
}: CountdownBannerProps) {
  return (
    <section className="rounded-2xl border border-[#1E293B] bg-[#101827] px-5 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#F8FAFC] sm:text-base">
            {isConfirmed
              ? "Tiket sudah terkonfirmasi"
              : isExpired
                ? "Batas waktu penahanan kursi berakhir"
                : "Kursimu ditahan selama 15 menit"}
          </h3>
          <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
            {isConfirmed
              ? "Pembayaran selesai dan kursi telah menjadi milikmu."
              : isExpired
                ? "Silakan pilih kursi ulang karena batas hold 15 menit sudah habis."
                : "Selesaikan pembayaran sebelum batas waktunya habis."}
          </p>
        </div>

        <span
          className={`shrink-0 font-mono text-2xl font-bold tabular-nums ${
            isConfirmed
              ? "text-[#22C55E]"
              : isExpired
                ? "text-[#EF4444]"
                : "text-[#F59E0B]"
          }`}
        >
          {isConfirmed ? "LUNAS" : formatCountdown(remainingMs)}
        </span>
      </div>
    </section>
  );
}
