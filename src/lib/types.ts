export interface MovieV2 {
  id: string;
  title: string;
  synopsis: string;
  durationMinutes: number;
  genres: string[];
  posterUrl: string;
  ageRating: string;
  director: string;
  cast: string[];
  trailerUrl?: string | null;
  releaseDate: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaName: string;
  studioName: string;
  startsAt: string;
  price: number;
}

export type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED";

export interface SeatAvailability {
  seatNumber: string;
  row: string;
  number: number;
  status: SeatStatus;
}

export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: string;
  showtimeId: string;
  seatNumber: string;
  status: BookingStatus;
  expiresAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export type DataSourceMode = "live" | "demo";

export interface CheckoutContext {
  booking?: Booking;
  showtime: Showtime;
  movie: MovieV2;
}
