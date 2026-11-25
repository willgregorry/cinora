"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKey, formatMonthYearId, parseDateKey } from "@/lib/format";
import { ModalBackdrop } from "../common/ModalBackdrop";

interface CalendarModalProps {
  open: boolean;
  selectedDateKey: string;
  minDateKey: string;
  onSelectDate: (dateKey: string) => void;
  onClose: () => void;
}

const WEEKDAYS_MON_FIRST = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function CalendarModal({
  open,
  selectedDateKey,
  minDateKey,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const initialDate = parseDateKey(selectedDateKey);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1, 12, 0, 0);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const minDateObj = parseDateKey(minDateKey);
  const canGoPrev =
    viewYear > minDateObj.getFullYear() ||
    (viewYear === minDateObj.getFullYear() &&
      viewMonth > minDateObj.getMonth());

  function prevMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const cells: Array<{
    day: number | null;
    dateKey?: string;
    disabled?: boolean;
  }> = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(viewYear, viewMonth, d, 12, 0, 0);
    const key = formatDateKey(dt);
    cells.push({
      day: d,
      dateKey: key,
      disabled: key < minDateKey,
    });
  }

  return (
    <ModalBackdrop open={open} label="Kalender Tanggal" onClose={onClose}>
      <div className="w-full max-w-[408px] rounded-2xl border border-[#334155] bg-[#161F30] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#F8FAFC]">
            {formatMonthYearId(viewYear, viewMonth)}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              aria-label="Bulan sebelumnya"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                canGoPrev
                  ? "border-[#334155] bg-[#0B1120] text-[#F8FAFC] hover:border-[#475569]"
                  : "cursor-not-allowed border-[#1E293B] bg-[#101827] text-[#475569]"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Bulan berikutnya"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] transition hover:border-[#475569]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#94A3B8]">
          {WEEKDAYS_MON_FIRST.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, idx) => {
            if (cell.day === null || !cell.dateKey) {
              return <div key={`empty-${idx}`} className="h-11" />;
            }
            const isSelected = cell.dateKey === selectedDateKey;
            return (
              <button
                key={cell.dateKey}
                type="button"
                disabled={cell.disabled}
                onClick={() => {
                  onSelectDate(cell.dateKey!);
                  onClose();
                }}
                className={`flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition ${
                  isSelected
                    ? "border-[#22C55E] bg-[#22C55E] font-semibold text-[#0B1120]"
                    : cell.disabled
                      ? "cursor-not-allowed border-[#1E293B] bg-[#141D2D] text-[#475569]"
                      : "border-[#334155] bg-[#0B1120] text-[#F8FAFC] hover:border-[#22C55E]/70"
                }`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-[#94A3B8]">
          Tanggal yang sudah lewat tidak dapat dipilih.
        </p>
      </div>
    </ModalBackdrop>
  );
}
