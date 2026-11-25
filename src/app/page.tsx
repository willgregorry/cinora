import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { HomeClient } from "@/components/home/HomeClient";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeClient />
      <Footer />
    </>
  );
}
