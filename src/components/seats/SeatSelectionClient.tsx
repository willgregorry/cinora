"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  ApiError,
  createBooking,
  fetchMovieById,
  fetchSeatsByShowtime,
  fetchShowtimeById,
} from "@/lib/api";
import { formatDayLongDateId, formatTimeWib } from "@/lib/format";
import { readCheckoutContext, saveCheckoutContext } from "@/lib/storage";
import type { MovieV2, SeatAvailability, Showtime } from "@/lib/types";
import { MoviePoster } from "../common/MoviePoster";
import { StatusBanner } from "../common/StatusBanner";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { SeatGrid } from "./SeatGrid";

interface SeatSelectionClientProps {
  showtimeId: string;
}

export function SeatSelectionClient({ showtimeId }: SeatSelectionClientProps) {
  const router = useRouter();

  const [movie, setMovie] = useState<MovieV2 | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<SeatAvailability[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const refreshSeatMap = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true);
      try {
        const res = await fetchSeatsByShowtime(showtimeId);
        setSeats(res.seats);
        setWarning(res.warning ?? null);
        setSelectedSeat((prev) => {
          if (!prev) return null;
          const found = res.seats.find((s) => s.seatNumber === prev);
          return found && found.status === "AVAILABLE" ? prev : null;
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat denah kursi dari Booking Service."
        );
      } finally {
        if (!silent) setRefreshing(false);
      }
    },
    [showtimeId]
  );

  useEffect(() => {
    let active = true;
    async function init() {
      const cached = readCheckoutContext(`showtime_${showtimeId}`);
      let resolvedShowtime: Showtime | null = cached?.showtime ?? null;
      let resolvedMovie: MovieV2 | null = cached?.movie ?? null;

      if (!resolvedShowtime) {
        const stRes = await fetchShowtimeById(showtimeId);
        resolvedShowtime = stRes.showtime;
      }
      if (resolvedShowtime && !resolvedMovie) {
        const mvRes = await fetchMovieById(resolvedShowtime.movieId);
        resolvedMovie = mvRes.movie;
      }

      if (!active) return;
      setShowtime(resolvedShowtime);
      setMovie(resolvedMovie);

      await refreshSeatMap(true);
      if (active) setLoading(false);
    }

    void init();
    return () => {
      active = false;
    };
  }, [showtimeId, refreshSeatMap]);

  async function handleProceedToPayment() {
    if (!selectedSeat || !showtime) return;
    setSubmitting(true);
    setError(null);
    try {
      const booking = await createBooking(showtimeId, selectedSeat);
      if (movie) {
        saveCheckoutContext(`booking_${booking.id}`, {
          booking,
          showtime,
          movie,
        });
      }
      router.push(`/bookings/${encodeURIComponent(booking.id)}/payment`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Gagal membuat reservasi kursi. Silakan coba lagi.";
      setError(msg);
      await refreshSeatMap(false);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="h-[460px] animate-pulse rounded-2xl border border-[#1E293B] bg-[#101827]" />
      </main>
    );
  }

  if (!showtime || !movie) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-[#1E293B] bg-[#101827] p-8 text-center">
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            Jadwal tayang tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Jadwal dengan ID {showtimeId} tidak tersedia atau Catalog Service
            sedang tidak aktif.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-[#0B1120]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-2 text-xs sm:text-sm"
      >
        <Link
          href={`/movies/${movie.id}`}
          className="inline-flex items-center gap-1.5 font-medium text-[#CBD5E1] transition hover:text-[#F8FAFC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Jadwal Film
        </Link>
        <span className="text-[#475569]">/</span>
        <span className="text-[#64748B]">Pilih Kursi</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
        Pilih Kursi
      </h1>
      <p className="mt-1.5 text-sm text-[#94A3B8]">
        Pilih satu kursi yang tersedia untuk jadwal tayangmu.
      </p>

      {warning && (
        <div className="mt-5">
          <StatusBanner variant="warning" message={warning} />
        </div>
      )}

      {error && (
        <div className="mt-5">
          <StatusBanner
            variant="error"
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-[#1E293B] bg-[#101827] p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <MoviePoster
            movie={movie}
            className="aspect-[2/3] w-16 shrink-0 sm:w-[70px]"
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#F8FAFC] sm:text-xl">
              {movie.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#CBD5E1]">
              {showtime.cinemaName} • {showtime.studioName}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
              {formatDayLongDateId(showtime.startsAt)} •{" "}
              {formatTimeWib(showtime.startsAt)} WIB
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SeatGrid
          seats={seats}
          selectedSeat={selectedSeat}
          refreshing={refreshing}
          onSelectSeat={(seatNumber) =>
            setSelectedSeat((prev) =>
              prev === seatNumber ? null : seatNumber
            )
          }
          onRefresh={() => void refreshSeatMap(false)}
        />
        <OrderSummaryCard
          movie={movie}
          showtime={showtime}
          selectedSeat={selectedSeat}
          submitting={submitting}
          onSubmit={() => void handleProceedToPayment()}
        />
      </div>
    </main>
  );
}
