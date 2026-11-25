import { ArrowRight, Loader2 } from "lucide-react";
import { formatRupiah, formatShortDayDateId, formatTimeWib } from "@/lib/format";
import type { MovieV2, Showtime } from "@/lib/types";

interface OrderSummaryCardProps {
  movie: MovieV2;
  showtime: Showtime;
  selectedSeat: string | null;
  submitting: boolean;
  onSubmit: () => void;
}

export function OrderSummaryCard({
  movie,
  showtime,
  selectedSeat,
  submitting,
  onSubmit,
}: OrderSummaryCardProps) {
  const timeLabel = formatTimeWib(showtime.startsAt);

  return (
    <aside className="h-fit rounded-2xl border border-[#1E293B] bg-[#101827] p-6 lg:col-span-4">
      <h2 className="text-lg font-bold text-[#F8FAFC]">Ringkasan Pesanan</h2>

      <div className="mt-5 space-y-3.5 text-sm">
        <div>
          <p className="text-xs text-[#64748B]">Film</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">{movie.title}</p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Bioskop</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {showtime.cinemaName} · {showtime.studioName}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Tanggal &amp; Jam</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {formatShortDayDateId(showtime.startsAt)} · {timeLabel}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Kursi Dipilih</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {selectedSeat ?? "Belum dipilih"}
          </p>
        </div>
      </div>

      <div className="my-5 border-t border-[#1E293B]" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#F8FAFC]">Total</span>
        <span className="text-xl font-bold text-[#22C55E]">
          {selectedSeat ? formatRupiah(showtime.price) : "Rp0"}
        </span>
      </div>

      <button
        type="button"
        disabled={!selectedSeat || submitting}
        onClick={onSubmit}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:bg-[#1E293B] disabled:text-[#64748B]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Membuat Reservasi...
          </>
        ) : (
          <>
            Lanjut ke Pembayaran
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-[#64748B]">
        Pastikan jadwal dan kursi sudah sesuai sebelum melanjutkan.
      </p>
    </aside>
  );
}
