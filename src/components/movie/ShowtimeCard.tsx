import Link from "next/link";
import { formatRupiah, formatTimeWib } from "@/lib/format";
import { saveCheckoutContext } from "@/lib/storage";
import type { MovieV2, Showtime } from "@/lib/types";

interface ShowtimeCardProps {
  cinemaName: string;
  address: string;
  price: number | null;
  items: Showtime[];
  movie: MovieV2;
}

export function ShowtimeCard({
  cinemaName,
  address,
  price,
  items,
  movie,
}: ShowtimeCardProps) {
  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#101827] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold uppercase tracking-wide text-[#F8FAFC]">
            {cinemaName}
          </h3>
          <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">{address}</p>
        </div>
        {price !== null ? (
          <span className="text-sm font-semibold text-[#22C55E]">
            {formatRupiah(price)} / tiket
          </span>
        ) : (
          <span className="text-sm text-[#64748B]">Tidak tersedia</span>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((st) => (
            <Link
              key={st.id}
              href={`/showtimes/${st.id}/seats`}
              onClick={() =>
                saveCheckoutContext(`showtime_${st.id}`, {
                  showtime: st,
                  movie,
                })
              }
              className="inline-flex h-11 min-w-[78px] items-center justify-center rounded-xl border border-[#334155] bg-[#1E293B] px-5 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#22C55E] hover:bg-[#22C55E]/15 hover:text-[#22C55E]"
            >
              {formatTimeWib(st.startsAt)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
