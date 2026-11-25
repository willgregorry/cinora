import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { MovieDetailClient } from "@/components/movie/MovieDetailClient";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ city?: string }>;
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: MovieDetailPageProps) {
  const { id } = await params;
  const { city } = await searchParams;

  return (
    <>
      <Navbar />
      <MovieDetailClient movieId={id} initialCity={city || "Malang"} />
      <Footer />
    </>
  );
}
