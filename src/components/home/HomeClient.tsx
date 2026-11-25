"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { fetchMovies } from "@/lib/api";
import type { DataSourceMode, MovieV2 } from "@/lib/types";
import { StatusBanner } from "../common/StatusBanner";
import { TrailerModal } from "../movie/TrailerModal";
import { HeroMovieCard } from "./HeroMovieCard";
import { HowToBookSection } from "./HowToBookSection";
import { MovieCard } from "./MovieCard";

const CITIES = ["Malang", "Surabaya", "Jakarta", "Semua Kota"];

export function HomeClient() {
  const [movies, setMovies] = useState<MovieV2[]>([]);
  const [source, setSource] = useState<DataSourceMode>("live");
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("Malang");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<MovieV2 | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleRetryCatalog = useCallback(async () => {
    setLoading(true);
    const res = await fetchMovies();
    setMovies(res.movies);
    setSource(res.source);
    setWarning(res.warning ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchMovies().then((res) => {
      if (!active) return;
      setMovies(res.movies);
      setSource(res.source);
      setWarning(res.warning ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const m of movies) {
      for (const g of m.genres || []) {
        set.add(g);
      }
    }
    return ["Semua", ...Array.from(set)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        (m.genres || []).some((g) => g.toLowerCase().includes(q));
      const matchesGenre =
        selectedGenre === "Semua" ||
        (m.genres || []).some(
          (g) => g.toLowerCase() === selectedGenre.toLowerCase()
        );
      return matchesQuery && matchesGenre;
    });
  }, [movies, search, selectedGenre]);

  const featuredMovie = filteredMovies[0] ?? movies[0] ?? null;

  function scrollCarousel(direction: "prev" | "next") {
    const el = carouselRef.current;
    if (!el) return;
    const offset = Math.max(260, el.clientWidth * 0.72);
    el.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
      {warning && (
        <div className="mb-6">
          <StatusBanner
            variant="warning"
            message={warning}
            onRetry={() => void handleRetryCatalog()}
          />
        </div>
      )}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
            Temukan film favoritmu
          </h1>
          <p className="mt-1.5 text-sm text-[#94A3B8]">
            Pilih film untuk melihat detail dan jadwalnya.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-fit">
            <MapPin
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <select
              aria-label="Pilih kota bioskop"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 appearance-none rounded-xl border border-[#334155] bg-[#101827] pl-10 pr-9 text-sm font-medium text-[#F8FAFC] focus:border-[#22C55E] focus:outline-none"
            >
              {CITIES.map((c) => (
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

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-[280px] md:w-[320px]">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul film..."
                aria-label="Cari judul film"
                className="h-12 w-full rounded-xl border border-[#334155] bg-[#101827] pl-11 pr-4 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#22C55E] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Filter genre film"
              aria-expanded={showFilters}
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
                showFilters || selectedGenre !== "Semua"
                  ? "border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]"
                  : "border-[#334155] bg-[#101827] text-[#CBD5E1] hover:border-[#475569]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {showFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {genres.map((genre) => {
            const active = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-[#22C55E] font-semibold text-[#0B1120]"
                    : "border border-[#334155] bg-[#101827] text-[#CBD5E1] hover:border-[#475569]"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      )}

      <section className="mt-8">
        {loading ? (
          <div className="h-[340px] animate-pulse rounded-2xl border border-[#1E293B] bg-[#101827]" />
        ) : featuredMovie ? (
          <HeroMovieCard
            movie={featuredMovie}
            city={city}
            onOpenTrailer={setTrailerMovie}
          />
        ) : null}
      </section>

      <section id="film" className="mt-12 scroll-mt-24">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
                Sedang Tayang
              </h2>
              {source === "live" && (
                <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#22C55E]">
                  Live API
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
              Pilih film untuk membaca detail dan mengecek jadwal.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="shrink-0 rounded-full bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#0B1120] transition hover:bg-white sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {showAll ? "Tampilan Carousel" : "Lihat Semua"}
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-2xl border border-[#1E293B] bg-[#101827]"
              />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#1E293B] bg-[#101827] px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#F8FAFC]">
              Tidak ada film yang cocok dengan pencarian &ldquo;{search}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedGenre("Semua");
              }}
              className="mt-3 text-xs font-semibold text-[#22C55E] hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : showAll ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} city={city} />
            ))}
          </div>
        ) : (
          <div className="relative mt-6">
            <button
              type="button"
              onClick={() => scrollCarousel("prev")}
              aria-label="Geser daftar film ke kiri"
              className="absolute -left-4 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#334155] bg-[#1E293B]/95 text-[#CBD5E1] shadow-lg transition hover:border-[#475569] hover:text-white lg:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-5"
            >
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="w-[224px] shrink-0 snap-start sm:w-[248px] lg:w-[272px]"
                >
                  <MovieCard movie={movie} city={city} />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              aria-label="Geser daftar film ke kanan"
              className="absolute -right-4 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#334155] bg-[#1E293B]/95 text-[#CBD5E1] shadow-lg transition hover:border-[#475569] hover:text-white lg:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>

      <HowToBookSection />

      <TrailerModal
        movie={trailerMovie}
        onClose={() => setTrailerMovie(null)}
      />
    </main>
  );
}
