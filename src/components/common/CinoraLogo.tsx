import { Ticket } from "lucide-react";

interface CinoraLogoProps {
  compact?: boolean;
}

export function CinoraLogo({ compact = false }: CinoraLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E] text-[#0B1120] shadow-sm">
        <Ticket className="h-4.5 w-4.5 stroke-[2.25]" aria-hidden="true" />
      </span>
      <span
        className={`font-bold tracking-tight text-[#F8FAFC] ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        CINORA
      </span>
    </span>
  );
}
