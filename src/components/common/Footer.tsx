import { CinoraLogo } from "./CinoraLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1E293B] bg-[#0B1120]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <CinoraLogo compact />
        <p className="text-xs text-[#64748B]">
          © 2026 CINORA · Cinema Ticket Booking
        </p>
      </div>
    </footer>
  );
}
