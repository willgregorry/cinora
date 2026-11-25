"use client";

import { useState } from "react";
import { getLocalPosterFallback, resolvePosterUrl } from "@/lib/format";
import type { MovieV2 } from "@/lib/types";

interface MoviePosterProps {
  movie: Pick<MovieV2, "title" | "posterUrl">;
  className?: string;
}

export function MoviePoster({ movie, className = "" }: MoviePosterProps) {
  const initialSrc = resolvePosterUrl(movie);
  const fallbackSrc = getLocalPosterFallback(movie);
  const [src, setSrc] = useState(initialSrc);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#1E293B] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Poster film ${movie.title}`}
        onError={() => {
          if (src !== fallbackSrc) {
            setSrc(fallbackSrc);
          }
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
