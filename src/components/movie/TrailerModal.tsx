"use client";

import { ExternalLink, Play, X } from "lucide-react";
import type { MovieV2 } from "@/lib/types";
import { ModalBackdrop } from "../common/ModalBackdrop";

interface TrailerModalProps {
  movie: MovieV2 | null;
  onClose: () => void;
}

function toYoutubeEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes("youtube.com")) {
      const vid = parsed.searchParams.get("v");
      return vid ? `https://www.youtube.com/embed/${vid}?autoplay=1` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const vid = parsed.pathname.replace("/", "");
      return vid ? `https://www.youtube.com/embed/${vid}?autoplay=1` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function TrailerModal({ movie, onClose }: TrailerModalProps) {
  const embedUrl = toYoutubeEmbedUrl(movie?.trailerUrl);

  return (
    <ModalBackdrop
      open={Boolean(movie)}
      label={movie ? `Trailer ${movie.title}` : "Trailer"}
      onClose={onClose}
    >
      {movie && (
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#334155] bg-[#101827] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E]/15 text-[#22C55E]">
                <Play className="h-4 w-4 fill-current" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  Trailer — {movie.title}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {movie.director} · {movie.durationMinutes} menit
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal trailer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#0B1120] text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            {embedUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1120]">
                <iframe
                  src={embedUrl}
                  title={`Trailer ${movie.title}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#0B1120] px-6 py-12 text-center">
                <p className="text-sm font-medium text-[#F8FAFC]">
                  Pratinjau trailer eksternal
                </p>
                <p className="mt-1.5 max-w-md text-xs text-[#94A3B8]">
                  {movie.trailerUrl
                    ? "Tautan trailer tersedia pada URL eksternal berikut:"
                    : "Trailer resmi belum disematkan untuk film ini."}
                </p>
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 text-xs font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
                  >
                    Buka Trailer di Tab Baru
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalBackdrop>
  );
}
