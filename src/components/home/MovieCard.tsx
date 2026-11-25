import Link from "next/link";
import type { MovieV2 } from "@/lib/types";
import { MoviePoster } from "../common/MoviePoster";

interface MovieCardProps {
  movie: MovieV2;
  city: string;
}

export function MovieCard({ movie, city }: MovieCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#1E293B] bg-[#101827] p-4 transition hover:border-[#334155]">
      <MoviePoster movie={movie} className="aspect-[2/3] w-full" />
      <h3 className="mt-3.5 line-clamp-1 text-base font-bold text-[#F8FAFC]">
        {movie.title}
      </h3>
      <p className="mt-1 text-xs text-[#94A3B8]">
        {movie.genres[0] || "Film"} · {movie.durationMinutes} menit
      </p>
      <Link
        href={`/movies/${movie.id}?city=${encodeURIComponent(city)}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
      >
        Lihat Detail
      </Link>
    </article>
  );
}
