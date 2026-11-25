import type { Booking, MovieV2, SeatAvailability, Showtime } from "./types";
import { formatDateKey } from "./format";

export const DEMO_MOVIES: MovieV2[] = [
  {
    id: "MV-DEMO-001",
    title: "Interstellar",
    synopsis:
      "Saat Bumi menghadapi krisis pangan, sekelompok penjelajah menempuh perjalanan melalui lubang cacing demi mencari planet baru untuk umat manusia.",
    durationMinutes: 169,
    genres: ["Sci-Fi", "Drama"],
    posterUrl: "/posters/interstellar.png",
    ageRating: "PG-13",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    releaseDate: "2014-11-07",
  },
  {
    id: "MV-DEMO-002",
    title: "The Avengers",
    synopsis:
      "Nick Fury mengumpulkan tim pahlawan super terhebat di Bumi untuk menghentikan ancaman Loki dan pasukan Chitauri.",
    durationMinutes: 143,
    genres: ["Action", "Sci-Fi"],
    posterUrl: "/posters/the-avengers.png",
    ageRating: "PG-13",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8",
    releaseDate: "2012-05-04",
  },
  {
    id: "MV-DEMO-003",
    title: "Dune: Part Two",
    synopsis:
      "Paul Atreides bersatu dengan suku Fremen untuk menuntut balas terhadap konspirator yang menghancurkan keluarganya di Arrakis.",
    durationMinutes: 166,
    genres: ["Sci-Fi", "Adventure"],
    posterUrl: "/posters/dune-part-two.png",
    ageRating: "13+",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    releaseDate: "2024-03-01",
  },
  {
    id: "MV-DEMO-004",
    title: "Avatar: The Way of Water",
    synopsis:
      "Jake Sully dan Neytiri berjuang melindungi keluarga mereka bersama klan lautan Metkayina di Pandora.",
    durationMinutes: 192,
    genres: ["Adventure", "Sci-Fi"],
    posterUrl: "/posters/avatar-the-way-of-water.png",
    ageRating: "13+",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldaña", "Sigourney Weaver"],
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    releaseDate: "2022-12-16",
  },
  {
    id: "MV-DEMO-005",
    title: "Oppenheimer",
    synopsis:
      "Kisah J. Robert Oppenheimer dan perannya memimpin Proyek Manhattan dalam pengembangan senjata nuklir pertama di dunia.",
    durationMinutes: 180,
    genres: ["Drama", "Biography"],
    posterUrl: "/posters/oppenheimer.png",
    ageRating: "17+",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    releaseDate: "2023-07-21",
  },
  {
    id: "MV-DEMO-006",
    title: "Spider-Man: No Way Home",
    synopsis:
      "Identitas Peter Parker terungkap ke publik, memicu retaknya multisemesta saat mantra Doctor Strange terganggu.",
    durationMinutes: 148,
    genres: ["Action", "Adventure"],
    posterUrl: "/posters/spider-man-no-way-home.png",
    ageRating: "13+",
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    releaseDate: "2021-12-17",
  },
];

export function buildDemoShowtimesForMovie(movieId: string): Showtime[] {
  const movieIndex = Math.max(
    1,
    DEMO_MOVIES.findIndex((m) => m.id === movieId) + 1
  );
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const showtimes: Showtime[] = [];

  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + offset);
    const key = formatDateKey(d);
    const numBase = movieIndex * 100 + offset * 10;

    showtimes.push(
      {
        id: `ST-DEMO-${numBase + 1}`,
        movieId,
        cinemaName: "ARAYA XXI",
        studioName: "Studio 2",
        startsAt: `${key}T15:30:00+07:00`,
        price: 35000,
      },
      {
        id: `ST-DEMO-${numBase + 2}`,
        movieId,
        cinemaName: "ARAYA XXI",
        studioName: "Studio 2",
        startsAt: `${key}T19:00:00+07:00`,
        price: 35000,
      },
      {
        id: `ST-DEMO-${numBase + 3}`,
        movieId,
        cinemaName: "DIENG XXI",
        studioName: "Studio 1",
        startsAt: `${key}T16:00:00+07:00`,
        price: 25000,
      },
      {
        id: `ST-DEMO-${numBase + 4}`,
        movieId,
        cinemaName: "DIENG XXI",
        studioName: "Studio 1",
        startsAt: `${key}T20:15:00+07:00`,
        price: 25000,
      }
    );
  }

  return showtimes;
}

export function findDemoShowtimeById(showtimeId: string): Showtime | null {
  for (const movie of DEMO_MOVIES) {
    const found = buildDemoShowtimesForMovie(movie.id).find((s) => s.id === showtimeId);
    if (found) return found;
  }
  return null;
}

const BOOKED_DEMO_SEATS = new Set(["B03", "B04", "D08", "E10"]);
const HELD_DEMO_SEATS = new Set(["B07", "D04"]);

export function buildDemoSeats(): SeatAvailability[] {
  const rows = ["A", "B", "C", "D", "E"];
  const list: SeatAvailability[] = [];
  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      const seatNumber = `${row}${String(num).padStart(2, "0")}`;
      let status: SeatAvailability["status"] = "AVAILABLE";
      if (BOOKED_DEMO_SEATS.has(seatNumber)) status = "BOOKED";
      else if (HELD_DEMO_SEATS.has(seatNumber)) status = "HELD";
      list.push({ seatNumber, row, number: num, status });
    }
  }
  return list;
}

export function createDemoBooking(showtimeId: string, seatNumber: string): Booking {
  const suffix = String(Math.floor(100 + Math.random() * 899));
  return {
    id: `BK-DEMO-${suffix}`,
    showtimeId,
    seatNumber,
    status: "PENDING_PAYMENT",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}
