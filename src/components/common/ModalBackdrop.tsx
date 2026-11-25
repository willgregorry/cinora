"use client";

import { useEffect } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface ModalBackdropProps {
  open: boolean;
  label: string;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ModalBackdrop({
  open,
  label,
  onClose,
  closeOnBackdrop = true,
  className = "items-center p-4",
  children,
}: ModalBackdropProps) {
  useEscapeKey(open && Boolean(onClose), () => onClose?.());

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center bg-[#0B1120]/80 backdrop-blur-sm ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div className="contents" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
