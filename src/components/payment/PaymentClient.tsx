"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import {
  ApiError,
  cancelBooking,
  createPayment,
  fetchBookingById,
  fetchMovieById,
  fetchShowtimeById,
} from "@/lib/api";
import { readCheckoutContext, saveCheckoutContext } from "@/lib/storage";
import type { Booking, MovieV2, Showtime } from "@/lib/types";
import { StatusBanner } from "../common/StatusBanner";
import { CancelOrderModal } from "./CancelOrderModal";
import { CountdownBanner } from "./CountdownBanner";
import { OrderDetailCard } from "./OrderDetailCard";
import { PaymentFailureModal } from "./PaymentFailureModal";
import { PaymentSuccessModal } from "./PaymentSuccessModal";
import { PaymentSummaryCard } from "./PaymentSummaryCard";

interface PaymentClientProps {
  bookingId: string;
}

export function PaymentClient({ bookingId }: PaymentClientProps) {
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<MovieV2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failMessage, setFailMessage] = useState<string | null>(null);

  const isPending = booking?.status === "PENDING_PAYMENT";
  const { remainingMs, isExpired } = useCountdown(
    booking?.expiresAt,
    Boolean(isPending)
  );

  const loadOrderAsync = useCallback(
    async (isCancelled: () => boolean) => {
      const cached = readCheckoutContext(`booking_${bookingId}`);

      try {
        const liveBooking =
          (await fetchBookingById(bookingId)) ?? cached?.booking ?? null;
        if (isCancelled()) return;

        if (!liveBooking) {
          setBooking(null);
          setLoading(false);
          return;
        }
        setBooking(liveBooking);

        let resolvedShowtime = cached?.showtime ?? null;
        if (!resolvedShowtime || resolvedShowtime.id !== liveBooking.showtimeId) {
          const stRes = await fetchShowtimeById(liveBooking.showtimeId);
          resolvedShowtime = stRes.showtime;
        }
        if (isCancelled()) return;
        setShowtime(resolvedShowtime);

        let resolvedMovie = cached?.movie ?? null;
        if (
          resolvedShowtime &&
          (!resolvedMovie || resolvedMovie.id !== resolvedShowtime.movieId)
        ) {
          const mvRes = await fetchMovieById(resolvedShowtime.movieId);
          resolvedMovie = mvRes.movie;
        }
        if (isCancelled()) return;
        setMovie(resolvedMovie);

        if (resolvedShowtime && resolvedMovie) {
          saveCheckoutContext(`booking_${liveBooking.id}`, {
            booking: liveBooking,
            showtime: resolvedShowtime,
            movie: resolvedMovie,
          });
        }
      } catch (err) {
        if (!isCancelled()) {
          if (cached?.booking) setBooking(cached.booking);
          if (cached?.showtime) setShowtime(cached.showtime);
          if (cached?.movie) setMovie(cached.movie);
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail pemesanan."
          );
        }
      } finally {
        if (!isCancelled()) {
          setLoading(false);
        }
      }
    },
    [bookingId]
  );

  const reloadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    await loadOrderAsync(() => false);
  }, [loadOrderAsync]);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) {
        void loadOrderAsync(() => cancelled);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loadOrderAsync]);

  async function handlePay() {
    if (!booking || !showtime) return;
    setPaying(true);
    setError(null);
    try {
      const payment = await createPayment(booking.id, showtime.price);
      if (payment.status === "SUCCESS") {
        const updated: Booking = { ...booking, status: "CONFIRMED" };
        setBooking(updated);
        if (movie) {
          saveCheckoutContext(`booking_${booking.id}`, {
            booking: updated,
            showtime,
            movie,
          });
        }
        setSuccessModalOpen(true);
      } else {
        setFailMessage(
          "Pembayaran belum berhasil. Pilih jadwal dan kursi lagi untuk membuat pesanan baru."
        );
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Pembayaran gagal diproses. Silakan pilih jadwal dan kursi lagi.";
      setFailMessage(msg);
    } finally {
      setPaying(false);
    }
  }

  async function handleConfirmCancel() {
    if (!booking) return;
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      setCancelModalOpen(false);
      router.push(`/showtimes/${encodeURIComponent(booking.showtimeId)}/seats`);
    } catch (err) {
      setCancelModalOpen(false);
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal membatalkan pesanan. Silakan coba lagi."
      );
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="h-[460px] animate-pulse rounded-2xl border border-[#1E293B] bg-[#101827]" />
      </main>
    );
  }

  if (!booking || !showtime || !movie) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-[#1E293B] bg-[#101827] p-8 text-center">
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            Data pemesanan tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Kode booking {bookingId} tidak ditemukan atau sesi sudah berakhir.
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
        className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm"
      >
        <Link
          href={`/showtimes/${encodeURIComponent(showtime.id)}/seats`}
          className="text-[#94A3B8] transition hover:text-[#F8FAFC]"
        >
          Pemesanan
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#475569]" />
        <span className="font-medium text-[#F8FAFC]">Pembayaran</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
        Pembayaran
      </h1>
      <p className="mt-1.5 text-sm text-[#94A3B8]">
        Periksa pesananmu sebelum menyelesaikan pembayaran.
      </p>

      {error && (
        <div className="mt-5">
          <StatusBanner
            variant="error"
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <OrderDetailCard
            booking={booking}
            showtime={showtime}
            movie={movie}
            isExpired={isExpired}
          />
          <CountdownBanner
            isConfirmed={booking.status === "CONFIRMED"}
            isExpired={isExpired}
            remainingMs={remainingMs}
          />
        </div>

        <PaymentSummaryCard
          price={showtime.price}
          showtimeId={showtime.id}
          status={booking.status}
          isExpired={isExpired}
          paying={paying}
          cancelling={cancelling}
          onPay={() => void handlePay()}
          onOpenCancel={() => setCancelModalOpen(true)}
        />
      </div>

      <CancelOrderModal
        open={cancelModalOpen}
        seatNumber={booking.seatNumber}
        cancelling={cancelling}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => void handleConfirmCancel()}
      />

      <PaymentSuccessModal
        open={successModalOpen}
        movieTitle={movie.title}
        startsAt={showtime.startsAt}
        bookingId={booking.id}
        seatNumber={booking.seatNumber}
      />

      <PaymentFailureModal
        message={failMessage}
        onRetry={() => {
          setFailMessage(null);
          void reloadOrder();
        }}
      />
    </main>
  );
}
