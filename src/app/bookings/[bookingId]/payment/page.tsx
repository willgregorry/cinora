import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { PaymentClient } from "@/components/payment/PaymentClient";

interface PaymentPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { bookingId } = await params;

  return (
    <>
      <Navbar />
      <PaymentClient bookingId={bookingId} />
      <Footer />
    </>
  );
}
