import {
  buildDemoSeats,
  buildDemoShowtimesForMovie,
  createDemoBooking,
  DEMO_MOVIES,
  findDemoShowtimeById,
} from "./demo-data";
import { readDemoBooking, saveDemoBooking } from "./storage";
import type {
  Booking,
  DataSourceMode,
  MovieV2,
  Payment,
  ProblemDetail,
  SeatAvailability,
  Showtime,
} from "./types";

export class ApiError extends Error {
  status: number;
  problem?: ProblemDetail;

  constructor(status: number, message: string, problem?: ProblemDetail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

export function isDemoId(id: string): boolean {
  return (
    id.startsWith("MV-DEMO-") ||
    id.startsWith("ST-DEMO-") ||
    id.startsWith("BK-DEMO-")
  );
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: init?.signal ?? AbortSignal.timeout(10_000),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, application/problem+json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let problem: ProblemDetail | undefined;
    let message = `Permintaan gagal dengan status HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ProblemDetail & { message?: string };
      problem = data;
      message = data.detail || data.message || data.title || message;
    } catch {
      problem = undefined;
    }
    throw new ApiError(res.status, message, problem);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export async function fetchMovies(): Promise<{
  movies: MovieV2[];
  source: DataSourceMode;
  warning?: string;
}> {
  try {
    const movies = await requestJson<MovieV2[]>("/api/catalog/movies");
    if (!movies || movies.length === 0) {
      return {
        movies: DEMO_MOVIES,
        source: "demo",
        warning:
          "Catalog Service (port 8081) aktif tetapi belum berisi data film v2. Jalankan npm run seed di folder cinora untuk mengisi database.",
      };
    }
    return { movies, source: "live" };
  } catch {
    return {
      movies: DEMO_MOVIES,
      source: "demo",
      warning:
        "Backend microservice belum aktif di port 8081–8083. Menampilkan mode pratinjau offline dari desain CINORA.",
    };
  }
}

export async function fetchMovieById(id: string): Promise<{
  movie: MovieV2 | null;
  source: DataSourceMode;
  warning?: string;
}> {
  if (isDemoId(id)) {
    const movie = DEMO_MOVIES.find((m) => m.id === id) ?? null;
    return {
      movie,
      source: "demo",
      warning: "Mode pratinjau offline aktif (backend belum terhubung).",
    };
  }

  try {
    const movie = await requestJson<MovieV2>(
      `/api/catalog/movies/${encodeURIComponent(id)}`
    );
    return { movie, source: "live" };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { movie: null, source: "live" };
    }
    const fallback = DEMO_MOVIES.find((m) => m.id === id) ?? null;
    return {
      movie: fallback,
      source: "demo",
      warning: "Catalog Service tidak dapat dihubungi.",
    };
  }
}

export async function fetchShowtimesByMovie(movieId: string): Promise<{
  showtimes: Showtime[];
  source: DataSourceMode;
}> {
  if (isDemoId(movieId)) {
    return { showtimes: buildDemoShowtimesForMovie(movieId), source: "demo" };
  }

  try {
    const showtimes = await requestJson<Showtime[]>(
      `/api/catalog/movies/${encodeURIComponent(movieId)}/showtimes`
    );
    return { showtimes, source: "live" };
  } catch {
    return { showtimes: [], source: "demo" };
  }
}

export async function fetchShowtimeById(showtimeId: string): Promise<{
  showtime: Showtime | null;
  source: DataSourceMode;
}> {
  if (isDemoId(showtimeId)) {
    return { showtime: findDemoShowtimeById(showtimeId), source: "demo" };
  }

  try {
    const showtime = await requestJson<Showtime>(
      `/api/catalog/showtimes/${encodeURIComponent(showtimeId)}`
    );
    return { showtime, source: "live" };
  } catch {
    return { showtime: null, source: "live" };
  }
}

export async function fetchSeatsByShowtime(showtimeId: string): Promise<{
  seats: SeatAvailability[];
  source: DataSourceMode;
  warning?: string;
}> {
  if (isDemoId(showtimeId)) {
    return {
      seats: buildDemoSeats(),
      source: "demo",
      warning: "Mode pratinjau offline aktif (Booking Service tidak terhubung).",
    };
  }

  try {
    const seats = await requestJson<SeatAvailability[]>(
      `/api/booking/showtimes/${encodeURIComponent(showtimeId)}/seats`
    );
    return { seats, source: "live" };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Booking Service tidak dapat dihubungi.";
    throw new ApiError(err instanceof ApiError ? err.status : 503, msg);
  }
}

export async function createBooking(
  showtimeId: string,
  seatNumber: string
): Promise<Booking> {
  if (isDemoId(showtimeId)) {
    const demoBooking = createDemoBooking(showtimeId, seatNumber);
    saveDemoBooking(demoBooking);
    return demoBooking;
  }

  return requestJson<Booking>("/api/booking/bookings", {
    method: "POST",
    body: JSON.stringify({ showtimeId, seatNumber }),
  });
}

export async function fetchBookingById(bookingId: string): Promise<Booking | null> {
  if (isDemoId(bookingId)) {
    return readDemoBooking(bookingId);
  }

  try {
    return await requestJson<Booking>(
      `/api/booking/bookings/${encodeURIComponent(bookingId)}`
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  if (isDemoId(bookingId)) {
    const existing = readDemoBooking(bookingId);
    const cancelled: Booking = {
      id: bookingId,
      showtimeId: existing?.showtimeId || "ST-DEMO-101",
      seatNumber: existing?.seatNumber || "C05",
      status: "CANCELLED",
      expiresAt: existing?.expiresAt || new Date().toISOString(),
    };
    saveDemoBooking(cancelled);
    return cancelled;
  }

  return requestJson<Booking>(
    `/api/booking/bookings/${encodeURIComponent(bookingId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ action: "CANCEL" }),
    }
  );
}

export async function createPayment(
  bookingId: string,
  amount: number
): Promise<Payment> {
  if (isDemoId(bookingId)) {
    const existing = readDemoBooking(bookingId);
    if (existing) {
      saveDemoBooking({ ...existing, status: "CONFIRMED" });
    }
    return {
      id: "PY-DEMO-001",
      bookingId,
      amount,
      status: bookingId.endsWith("-FAIL") ? "FAILED" : "SUCCESS",
    };
  }

  return requestJson<Payment>("/api/payment/payments", {
    method: "POST",
    body: JSON.stringify({ bookingId, amount }),
  });
}
