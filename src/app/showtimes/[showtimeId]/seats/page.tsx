import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { SeatSelectionClient } from "@/components/seats/SeatSelectionClient";

interface SeatSelectionPageProps {
  params: Promise<{ showtimeId: string }>;
}

export default async function SeatSelectionPage({
  params,
}: SeatSelectionPageProps) {
  const { showtimeId } = await params;

  return (
    <>
      <Navbar />
      <SeatSelectionClient showtimeId={showtimeId} />
      <Footer />
    </>
  );
}
