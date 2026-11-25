import type { MovieV2 } from "./types";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTHS_SHORT_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DAYS_LONG_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const DAYS_SHORT_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const WIB_TIMEZONE = "Asia/Jakarta";

function getWibParts(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      monthIndex: now.getMonth(),
      day: now.getDate(),
      hour: 0,
      minute: 0,
      weekday: now.getDay(),
    };
  }

  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    map[part.type] = part.value;
  }

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: Number(map.year),
    monthIndex: Number(map.month) - 1,
    day: Number(map.day),
    hour: Number(map.hour === "24" ? "0" : map.hour),
    minute: Number(map.minute),
    weekday: weekdayMap[map.weekday] ?? date.getDay(),
  };
}

export function formatRupiah(amount: number): string {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}

export function formatDateKey(input: string | Date): string {
  const p = getWibParts(input);
  const mm = String(p.monthIndex + 1).padStart(2, "0");
  const dd = String(p.day).padStart(2, "0");
  return `${p.year}-${mm}-${dd}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

export function formatLongDateId(input: string | Date): string {
  const p = getWibParts(input);
  return `${p.day} ${MONTHS_ID[p.monthIndex]} ${p.year}`;
}

export function formatDayLongDateId(input: string | Date): string {
  const p = getWibParts(input);
  return `${DAYS_LONG_ID[p.weekday]}, ${p.day} ${MONTHS_ID[p.monthIndex]} ${p.year}`;
}

export function formatShortDayDateId(input: string | Date): string {
  const p = getWibParts(input);
  return `${DAYS_SHORT_ID[p.weekday]}, ${p.day} ${MONTHS_SHORT_ID[p.monthIndex]} ${p.year}`;
}

export function formatDayChip(dateKey: string): { dayShort: string; dayNum: string } {
  const d = parseDateKey(dateKey);
  return {
    dayShort: DAYS_SHORT_ID[d.getDay()],
    dayNum: String(d.getDate()),
  };
}

export function formatTimeWib(input: string | Date): string {
  const p = getWibParts(input);
  return `${String(p.hour).padStart(2, "0")}.${String(p.minute).padStart(2, "0")}`;
}

export function formatMonthYearId(year: number, monthIndex: number): string {
  return `${MONTHS_ID[monthIndex]} ${year}`;
}

export function formatCountdown(msRemaining: number): string {
  const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function extractReleaseYear(releaseDate?: string | null): string {
  return releaseDate ? releaseDate.slice(0, 4) : "2026";
}

const LOCAL_POSTER_BY_KEYWORD: Array<[string, string]> = [
  ["interstellar", "/posters/interstellar.png"],
  ["avengers", "/posters/the-avengers.png"],
  ["dune", "/posters/dune-part-two.png"],
  ["avatar", "/posters/avatar-the-way-of-water.png"],
  ["oppenheimer", "/posters/oppenheimer.png"],
  ["spider-man", "/posters/spider-man-no-way-home.png"],
  ["spiderman", "/posters/spider-man-no-way-home.png"],
];

export function getLocalPosterFallback(
  movie: Pick<MovieV2, "title" | "posterUrl">
): string {
  const lower = movie.title.toLowerCase();
  for (const [kw, path] of LOCAL_POSTER_BY_KEYWORD) {
    if (lower.includes(kw)) return path;
  }
  return "/posters/interstellar.png";
}

export function resolvePosterUrl(
  movie: Pick<MovieV2, "title" | "posterUrl">
): string {
  const url = (movie.posterUrl || "").trim();
  if (!url || url.includes("example.com")) {
    return getLocalPosterFallback(movie);
  }
  return url;
}

export function inferCinemaMeta(cinemaName: string): {
  city: string;
  address: string;
} {
  const lower = cinemaName.toLowerCase();
  if (lower.includes("araya")) {
    return { city: "Malang", address: "Plaza Araya, Malang" };
  }
  if (lower.includes("dieng")) {
    return { city: "Malang", address: "Dieng Plaza, Malang" };
  }
  if (lower.includes("transmart") || lower.includes("mx mall")) {
    return { city: "Malang", address: "Transmart MX Mall, Malang" };
  }
  if (lower.includes("tunjungan") || lower.includes("pakuwon") || lower.includes("surabaya")) {
    return { city: "Surabaya", address: `${cinemaName}, Surabaya` };
  }
  if (lower.includes("grand indonesia") || lower.includes("senayan") || lower.includes("jakarta")) {
    return { city: "Jakarta", address: `${cinemaName}, Jakarta` };
  }
  return { city: "Malang", address: `${cinemaName}, Malang` };
}
