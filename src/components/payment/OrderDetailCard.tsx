import {
  formatDayLongDateId,
  formatLongDateId,
  formatTimeWib,
  inferCinemaMeta,
} from "@/lib/format";
import type { Booking, MovieV2, Showtime } from "@/lib/types";
import { MoviePoster } from "../common/MoviePoster";

interface OrderDetailCardProps {
  booking: Booking;
  showtime: Showtime;
  movie: MovieV2;
  isExpired: boolean;
}

export function OrderDetailCard({
  booking,
  showtime,
  movie,
  isExpired,
}: OrderDetailCardProps) {
  const timeLabel = formatTimeWib(showtime.startsAt);
  const cinemaMeta = inferCinemaMeta(showtime.cinemaName);

  let statusBadgeLabel = "Menunggu Pembayaran";
  let statusBadgeClass = "bg-[#7A2E0E] text-[#FEDF89]";
  if (booking.status === "CONFIRMED") {
    statusBadgeLabel = "Terkonfirmasi";
    statusBadgeClass = "bg-[#14532D] text-[#86EFAC]";
  } else if (booking.status === "CANCELLED" || isExpired) {
    statusBadgeLabel = isExpired ? "Hold Kedaluwarsa" : "Dibatalkan";
    statusBadgeClass = "bg-[#7A271A] text-[#FECACA]";
  }

  return (
    <section className="rounded-2xl border border-[#1E293B] bg-[#101827] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#F8FAFC]">Detail Pesanan</h2>
        <span
          className={`rounded-full px-3.5 py-1 text-xs font-semibold ${statusBadgeClass}`}
        >
          {statusBadgeLabel}
        </span>
      </div>

      <div className="mt-5 flex items-start gap-4">
        <MoviePoster
          movie={movie}
          className="aspect-[2/3] w-20 shrink-0 sm:w-[88px]"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#F8FAFC] sm:text-xl">
            {movie.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#CBD5E1]">
            {showtime.cinemaName} • {showtime.studioName}
          </p>
          <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
            {formatDayLongDateId(showtime.startsAt)} • {timeLabel} WIB
          </p>
        </div>
      </div>

      <div className="my-5 border-t border-[#1E293B]" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div>
          <p className="text-xs text-[#64748B]">Tanggal</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {formatLongDateId(showtime.startsAt)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Jam Tayang</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">{timeLabel} WIB</p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Studio</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {showtime.studioName}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Kursi</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {booking.seatNumber}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Bioskop</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">
            {cinemaMeta.address}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Kode Booking</p>
          <p className="mt-0.5 font-semibold text-[#F8FAFC]">{booking.id}</p>
        </div>
      </div>
    </section>
  );
}
