import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { extractReleaseYear } from "@/lib/format";
import type { MovieV2 } from "@/lib/types";
import { MoviePoster } from "../common/MoviePoster";

interface HeroMovieCardProps {
  movie: MovieV2;
  city: string;
  onOpenTrailer: (movie: MovieV2) => void;
}

export function HeroMovieCard({
  movie,
  city,
  onOpenTrailer,
}: HeroMovieCardProps) {
  const detailHref = `/movies/${movie.id}?city=${encodeURIComponent(city)}`;

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#101827] p-5 sm:p-8">
      <div className="flex flex-row items-start gap-4 sm:gap-8">
        <MoviePoster
          movie={movie}
          className="aspect-[2/3] w-28 shrink-0 sm:w-48 lg:w-[220px]"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#334155] bg-[#1E293B] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#CBD5E1] uppercase">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            FILM PILIHAN
          </div>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
            {movie.title}
          </h2>

          <p className="mt-1.5 text-xs text-[#94A3B8] sm:text-sm">
            {movie.genres.join(" · ")} · {movie.durationMinutes} menit
            {movie.ageRating ? ` · ${movie.ageRating}` : ""}
          </p>

          <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
            {movie.director} · {extractReleaseYear(movie.releaseDate)}
          </p>

          <p className="mt-3 line-clamp-3 max-w-2xl text-xs leading-relaxed text-[#CBD5E1] sm:mt-4 sm:line-clamp-none sm:text-sm">
            {movie.synopsis}
          </p>

          <div className="mt-5 hidden flex-wrap items-center gap-3 sm:flex">
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
            >
              Lihat Detail
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => onOpenTrailer(movie)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#334155] bg-[#1E293B] px-5 py-3 text-sm font-medium text-[#F8FAFC] transition hover:border-[#475569] hover:bg-[#273549]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Tonton Trailer
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
        <Link
          href={detailHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-xs font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
        >
          Lihat Detail
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => onOpenTrailer(movie)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-2.5 text-xs font-medium text-[#F8FAFC]"
        >
          <Play className="h-3 w-3 fill-current" />
          Tonton Trailer
        </button>
      </div>
    </div>
  );
}
