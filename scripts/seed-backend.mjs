const CATALOG_BASE =
  process.env.CATALOG_API_URL ||
  process.env.NEXT_PUBLIC_CATALOG_API_URL ||
  "http://localhost:8081";

const MOVIES_SEED = [
  {
    title: "Interstellar",
    synopsis:
      "Saat Bumi menghadapi krisis pangan, sekelompok penjelajah menempuh perjalanan melalui lubang cacing demi mencari planet baru untuk umat manusia.",
    durationMinutes: 169,
    genres: ["Sci-Fi", "Drama"],
    posterUrl: "https://images.example.com/posters/interstellar.jpg",
    ageRating: "PG-13",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    releaseDate: "2014-11-07",
  },
  {
    title: "The Avengers",
    synopsis:
      "Nick Fury mengumpulkan tim pahlawan super terhebat di Bumi untuk menghentikan ancaman Loki dan pasukan Chitauri.",
    durationMinutes: 143,
    genres: ["Action", "Sci-Fi"],
    posterUrl: "https://images.example.com/posters/the-avengers.jpg",
    ageRating: "PG-13",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8",
    releaseDate: "2012-05-04",
  },
  {
    title: "Dune: Part Two",
    synopsis:
      "Paul Atreides bersatu dengan suku Fremen untuk menuntut balas terhadap konspirator yang menghancurkan keluarganya di Arrakis.",
    durationMinutes: 166,
    genres: ["Sci-Fi", "Adventure"],
    posterUrl: "https://images.example.com/posters/dune-part-two.jpg",
    ageRating: "13+",
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"],
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    releaseDate: "2024-03-01",
  },
  {
    title: "Avatar: The Way of Water",
    synopsis:
      "Jake Sully dan Neytiri berjuang melindungi keluarga mereka bersama klan lautan Metkayina di Pandora.",
    durationMinutes: 192,
    genres: ["Adventure", "Sci-Fi"],
    posterUrl: "https://images.example.com/posters/avatar-the-way-of-water.jpg",
    ageRating: "13+",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    releaseDate: "2022-12-16",
  },
  {
    title: "Oppenheimer",
    synopsis:
      "Kisah J. Robert Oppenheimer dan perannya memimpin Proyek Manhattan dalam pengembangan senjata nuklir pertama di dunia.",
    durationMinutes: 180,
    genres: ["Drama", "Biography"],
    posterUrl: "https://images.example.com/posters/oppenheimer.jpg",
    ageRating: "17+",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    releaseDate: "2023-07-21",
  },
  {
    title: "Spider-Man: No Way Home",
    synopsis:
      "Identitas Peter Parker terungkap ke publik, memicu retaknya multisemesta saat mantra Doctor Strange terganggu.",
    durationMinutes: 148,
    genres: ["Action", "Adventure"],
    posterUrl: "https://images.example.com/posters/spider-man-no-way-home.jpg",
    ageRating: "13+",
    director: "Jon Watts",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    releaseDate: "2021-12-17",
  },
];

function formatDateWib(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

async function api(path, init) {
  const res = await fetch(`${CATALOG_BASE}/api/v2${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${init?.method || "GET"} ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log(`Seeding CINORA movies & showtimes at ${CATALOG_BASE} ...`);
  const existingMovies = await api("/movies");
  const movieByTitle = new Map(
    existingMovies.map((m) => [m.title.toLowerCase(), m])
  );

  const now = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(formatDateWib(d));
  }

  for (const seedMovie of MOVIES_SEED) {
    let movie = movieByTitle.get(seedMovie.title.toLowerCase());
    if (!movie) {
      movie = await api("/movies", {
        method: "POST",
        body: JSON.stringify(seedMovie),
      });
      console.log(`+ Created movie: ${movie.id} (${movie.title})`);
    } else {
      console.log(`= Exists movie:  ${movie.id} (${movie.title})`);
    }

    const existingShowtimes = await api(`/movies/${movie.id}/showtimes`);
    if (existingShowtimes.length > 0) {
      console.log(
        `  = Already has ${existingShowtimes.length} showtime(s), skipping.`
      );
      continue;
    }

    const slots = [
      { cinemaName: "ARAYA XXI", studioName: "Studio 2", time: "15:30:00", price: 35000 },
      { cinemaName: "ARAYA XXI", studioName: "Studio 2", time: "19:00:00", price: 35000 },
      { cinemaName: "DIENG XXI", studioName: "Studio 1", time: "16:00:00", price: 25000 },
      { cinemaName: "DIENG XXI", studioName: "Studio 1", time: "20:15:00", price: 25000 },
    ];

    let createdCount = 0;
    for (const dayKey of days) {
      for (const slot of slots) {
        await api("/showtimes", {
          method: "POST",
          body: JSON.stringify({
            movieId: movie.id,
            cinemaName: slot.cinemaName,
            studioName: slot.studioName,
            startsAt: `${dayKey}T${slot.time}+07:00`,
            price: slot.price,
          }),
        });
        createdCount++;
      }
    }
    console.log(`  + Created ${createdCount} showtime(s) for ${movie.title}`);
  }

  console.log("Seed selesai!");
}

main().catch((err) => {
  console.error("Seed gagal:", err.message);
  process.exit(1);
});
