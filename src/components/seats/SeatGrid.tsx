import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import type { SeatAvailability } from "@/lib/types";

interface SeatGridProps {
  seats: SeatAvailability[];
  selectedSeat: string | null;
  refreshing: boolean;
  onSelectSeat: (seatNumber: string) => void;
  onRefresh: () => void;
}

const ROWS = ["A", "B", "C", "D", "E"];

export function SeatGrid({
  seats,
  selectedSeat,
  refreshing,
  onSelectSeat,
  onRefresh,
}: SeatGridProps) {
  const seatsByRow = useMemo(() => {
    const map = new Map<string, SeatAvailability[]>();
    for (const r of ROWS) map.set(r, []);
    for (const s of seats) {
      const bucket = map.get(s.row) ?? [];
      bucket.push(s);
      map.set(s.row, bucket);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.number - b.number);
    }
    return map;
  }, [seats]);

  return (
    <section className="rounded-2xl border border-[#1E293B] bg-[#101827] p-5 sm:p-7 lg:col-span-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="sm:hidden">
          <h2 className="text-base font-bold text-[#F8FAFC]">
            Pilih Tempat Duduk
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Geser denah ke samping untuk melihat semua kursi.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#334155] bg-[#0B1120] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:border-[#475569] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh Kursi
        </button>
      </div>

      <div className="mb-7 text-center">
        <p className="mb-2 text-[11px] font-semibold tracking-widest text-[#94A3B8] uppercase">
          LAYAR
        </p>
        <div className="mx-auto h-1.5 max-w-md rounded-full bg-[#94A3B8]/80 shadow-[0_6px_18px_rgba(148,163,184,0.25)]" />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="mx-auto min-w-[540px] max-w-[600px] space-y-2.5">
          {ROWS.map((row) => {
            const rowSeats = seatsByRow.get(row) ?? [];
            return (
              <div key={row} className="flex items-center gap-2 sm:gap-3">
                <span className="w-5 shrink-0 text-center text-xs font-semibold text-[#94A3B8]">
                  {row}
                </span>
                <div className="grid flex-1 grid-cols-10 gap-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeat === seat.seatNumber;
                    const disabled = seat.status !== "AVAILABLE";

                    let seatClasses =
                      "border-[#334155] bg-[#1E293B] text-[#E2E8F0] hover:border-[#22C55E] hover:text-white";
                    if (isSelected) {
                      seatClasses =
                        "border-[#22C55E] bg-[#22C55E] text-[#0B1120] font-bold shadow-sm";
                    } else if (seat.status === "HELD") {
                      seatClasses =
                        "border-[#F59E0B] bg-[#F59E0B] text-[#0B1120] font-semibold cursor-not-allowed";
                    } else if (seat.status === "BOOKED") {
                      seatClasses =
                        "border-[#EF4444] bg-[#EF4444] text-[#0B1120] font-semibold cursor-not-allowed";
                    }

                    return (
                      <button
                        key={seat.seatNumber}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelectSeat(seat.seatNumber)}
                        aria-label={`Kursi ${seat.seatNumber} - ${
                          isSelected
                            ? "Dipilih"
                            : seat.status === "AVAILABLE"
                              ? "Tersedia"
                              : seat.status === "HELD"
                                ? "Ditahan"
                                : "Terisi"
                        }`}
                        className={`flex h-10 items-center justify-center rounded-lg border text-xs transition ${seatClasses}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-[#94A3B8]">
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded border border-[#334155] bg-[#1E293B]" />
          Tersedia
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-[#22C55E]" />
          Dipilih
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-[#F59E0B]" />
          Ditahan
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-[#EF4444]" />
          Terisi
        </span>
      </div>

      <p className="mt-4 text-center text-xs text-[#64748B]">
        Klik kursi berwarna gelap untuk memilih. Kursi terisi atau ditahan tidak
        dapat dipilih.
      </p>
    </section>
  );
}
