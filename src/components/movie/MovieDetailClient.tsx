"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Play,
} from "lucide-react";
import { fetchMovieById, fetchShowtimesByMovie } from "@/lib/api";
import {
  extractReleaseYear,
  formatDateKey,
  formatDayChip,
  formatMonthYearId,
  inferCinemaMeta,
  parseDateKey,
} from "@/lib/format";
import type { DataSourceMode, MovieV2, Showtime } from "@/lib/types";
import { MoviePoster } from "../common/MoviePoster";
import { StatusBanner } from "../common/StatusBanner";
import { CalendarModal } from "./CalendarModal";
import { ShowtimeCard } from "./ShowtimeCard";
import { TrailerModal } from "./TrailerModal";

interface MovieDetailClientProps {
  movieId: string;
  initialCity?: string;
}

export function MovieDetailClient({
  movieId,
  initialCity = "Malang",
}: MovieDetailClientProps) {
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const [movie, setMovie] = useState<MovieV2 | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [source, setSource] = useState<DataSourceMode>("live");
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(initialCity);
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [stripStartKey, setStripStartKey] = useState(todayKey);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const applyMovieAndShowtimes = useCallback(
    (
      movieRes: Awaited<ReturnType<typeof fetchMovieById>>,
      showRes: Awaited<ReturnType<typeof fetchShowtimesByMovie>>
    ) => {
      setMovie(movieRes.movie);
      setShowtimes(showRes.showtimes);
      setSource(movieRes.source);
      setWarning(movieRes.warning ?? null);

      if (showRes.showtimes.length > 0) {
        const sortedKeys = Array.from(
          new Set(showRes.showtimes.map((s) => formatDateKey(s.startsAt)))
        ).sort();
        const firstUpcoming =
          sortedKeys.find((k) => k >= todayKey) ?? sortedKeys[0];
        if (firstUpcoming) {
          setSelectedDateKey(firstUpcoming);
          setStripStartKey(firstUpcoming);
        }
      }
      setLoading(false);
    },
    [todayKey]
  );

  const handleRetryData = useCallback(async () => {
    setLoading(true);
    const [movieRes, showRes] = await Promise.all([
      fetchMovieById(movieId),
      fetchShowtimesByMovie(movieId),
    ]);
    applyMovieAndShowtimes(movieRes, showRes);
  }, [movieId, applyMovieAndShowtimes]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchMovieById(movieId), fetchShowtimesByMovie(movieId)]).then(
      ([movieRes, showRes]) => {
        if (!cancelled) {
          applyMovieAndShowtimes(movieRes, showRes);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [movieId, applyMovieAndShowtimes]);

  const availableCities = useMemo(() => {
    const set = new Set<string>(["Malang"]);
    for (const st of showtimes) {
      set.add(inferCinemaMeta(st.cinemaName).city);
    }
    return [...Array.from(set), "Semua Kota"];
  }, [showtimes]);

  const stripDates = useMemo(() => {
    const start = parseDateKey(stripStartKey);
    const keys: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      keys.push(formatDateKey(d));
    }
    return keys;
  }, [stripStartKey]);

  const selectedDateObj = parseDateKey(selectedDateKey);

  function shiftStrip(days: number) {
    const cur = parseDateKey(stripStartKey);
    cur.setDate(cur.getDate() + days);
    const nextKey = formatDateKey(cur);
    if (nextKey < todayKey) {
      setStripStartKey(todayKey);
      return;
    }
    setStripStartKey(nextKey);
  }

  const cinemaGroups = useMemo(() => {
    const forDayAndCity = showtimes.filter((st) => {
      const key = formatDateKey(st.startsAt);
      const stCity = inferCinemaMeta(st.cinemaName).city;
      const cityMatch = city === "Semua Kota" || stCity === city;
      return key === selectedDateKey && cityMatch;
    });

    const map = new Map<
      string,
      {
        cinemaName: string;
        address: string;
        price: number | null;
        items: Showtime[];
      }
    >();

    for (const st of forDayAndCity) {
      const existing = map.get(st.cinemaName);
      if (existing) {
        existing.items.push(st);
      } else {
        map.set(st.cinemaName, {
          cinemaName: st.cinemaName,
          address: inferCinemaMeta(st.cinemaName).address,
          price: st.price,
          items: [st],
        });
      }
    }

    if (source === "demo" && city === "Malang" && !map.has("TRANSMART MX MALL XXI")) {
      map.set("TRANSMART MX MALL XXI", {
        cinemaName: "TRANSMART MX MALL XXI",
        address: "Belum ada jadwal untuk film ini pada tanggal yang dipilih.",
        price: null,
        items: [],
      });
    }

    return Array.from(map.values());
  }, [showtimes, selectedDateKey, city, source]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="h-[360px] animate-pulse rounded-2xl border border-[#1E293B] bg-[#101827]" />
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-[#1E293B] bg-[#101827] p-8 text-center">
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            Film tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Film dengan ID {movieId} tidak tersedia di katalog saat ini.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-[#0B1120]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Film
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 lg:px-12">
      {warning && (
        <div className="mb-6">
          <StatusBanner
            variant="warning"
            message={warning}
            onRetry={() => void handleRetryData()}
          />
        </div>
      )}

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs sm:text-sm"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-medium text-[#CBD5E1] transition hover:text-[#F8FAFC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Film
        </Link>
        <span className="text-[#475569]">/</span>
        <span className="text-[#64748B]">Detail Film</span>
      </nav>

      <section className="rounded-2xl border border-[#1E293B] bg-[#101827] p-5 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <MoviePoster
            movie={movie}
            className="mx-auto aspect-[2/3] w-52 shrink-0 sm:w-60 md:mx-0 md:w-[232px]"
          />

          <div className="flex flex-1 flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#334155] bg-[#1E293B] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#CBD5E1] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              FILM PILIHAN
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8]">
              {movie.genres.join(" · ")} · {movie.durationMinutes} menit
              {movie.ageRating ? ` · ${movie.ageRating}` : ""}
            </p>
            <p className="mt-1 text-xs text-[#94A3B8]">
              {extractReleaseYear(movie.releaseDate)}
            </p>

            <div className="mt-5">
              <h2 className="text-sm font-semibold text-[#F8FAFC]">Sinopsis</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
                {movie.synopsis}
              </p>
            </div>

            <div className="mt-4 space-y-1.5 text-sm">
              <p className="text-[#94A3B8]">
                <span className="font-semibold text-[#F8FAFC]">Sutradara</span>
                <span className="ml-2">{movie.director}</span>
              </p>
              {movie.cast && movie.cast.length > 0 && (
                <p className="text-[#94A3B8]">
                  <span className="font-semibold text-[#F8FAFC]">Pemeran</span>
                  <span className="ml-2">{movie.cast.join(", ")}</span>
                </p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#334155] bg-[#1E293B] px-5 py-2.5 text-sm font-medium text-[#F8FAFC] transition hover:border-[#475569] hover:bg-[#273549]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Tonton Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
              Jadwal &amp; Tiket
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Pilih tanggal, bioskop, dan jam tayang yang tersedia.
            </p>
          </div>

          <div className="relative w-fit">
            <MapPin
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <select
              aria-label="Filter kota jadwal"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 appearance-none rounded-xl border border-[#334155] bg-[#101827] pl-10 pr-9 text-sm font-medium text-[#F8FAFC] focus:border-[#22C55E] focus:outline-none"
            >
              {availableCities.map((c) => (
                <option key={c} value={c} className="bg-[#101827]">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-xl border border-[#334155] bg-[#101827] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] transition hover:border-[#475569]"
          >
            <Calendar className="h-4 w-4 text-[#94A3B8]" />
            <span>
              {formatMonthYearId(
                selectedDateObj.getFullYear(),
                selectedDateObj.getMonth()
              )}
            </span>
            <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => shiftStrip(-7)}
            disabled={stripStartKey <= todayKey}
            aria-label="Minggu sebelumnya"
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              stripStartKey <= todayKey
                ? "cursor-not-allowed border-[#1E293B] bg-[#101827] text-[#475569]"
                : "border-[#334155] bg-[#101827] text-[#CBD5E1] hover:border-[#475569]"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {stripDates.map((dateKey) => {
            const { dayShort, dayNum } = formatDayChip(dateKey);
            const active = dateKey === selectedDateKey;
            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDateKey(dateKey)}
                className={`flex h-16 w-[68px] shrink-0 flex-col items-center justify-center rounded-xl border transition ${
                  active
                    ? "border-[#22C55E] bg-[#22C55E] text-[#0B1120]"
                    : "border-[#1E293B] bg-[#101827] text-[#F8FAFC] hover:border-[#334155]"
                }`}
              >
                <span
                  className={`text-xs ${
                    active ? "font-medium text-[#0B1120]/80" : "text-[#94A3B8]"
                  }`}
                >
                  {dayShort}
                </span>
                <span className="mt-0.5 text-lg font-bold leading-none">
                  {dayNum}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => shiftStrip(7)}
            aria-label="Minggu berikutnya"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#334155] bg-[#101827] text-[#CBD5E1] transition hover:border-[#475569]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {cinemaGroups.length === 0 ? (
            <ShowtimeCard
              cinemaName="JADWAL BIOSKOP"
              address="Belum ada jadwal untuk film ini pada tanggal yang dipilih."
              price={null}
              items={[]}
              movie={movie}
            />
          ) : (
            cinemaGroups.map((group) => (
              <ShowtimeCard
                key={group.cinemaName}
                cinemaName={group.cinemaName}
                address={group.address}
                price={group.price}
                items={group.items}
                movie={movie}
              />
            ))
          )}
        </div>
      </section>

      <CalendarModal
        open={calendarOpen}
        selectedDateKey={selectedDateKey}
        minDateKey={todayKey}
        onSelectDate={(dateKey) => {
          setSelectedDateKey(dateKey);
          setStripStartKey(dateKey);
        }}
        onClose={() => setCalendarOpen(false)}
      />

      <TrailerModal
        movie={trailerOpen ? movie : null}
        onClose={() => setTrailerOpen(false)}
      />
    </main>
  );
}
