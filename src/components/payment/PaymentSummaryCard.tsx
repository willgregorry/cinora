import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { BookingStatus } from "@/lib/types";

interface PaymentSummaryCardProps {
  price: number;
  showtimeId: string;
  status: BookingStatus;
  isExpired: boolean;
  paying: boolean;
  cancelling: boolean;
  onPay: () => void;
  onOpenCancel: () => void;
}

export function PaymentSummaryCard({
  price,
  showtimeId,
  status,
  isExpired,
  paying,
  cancelling,
  onPay,
  onOpenCancel,
}: PaymentSummaryCardProps) {
  const isConfirmed = status === "CONFIRMED";
  const isCancelled = status === "CANCELLED";

  return (
    <aside className="h-fit rounded-2xl border border-[#1E293B] bg-[#101827] p-6 lg:col-span-4">
      <h2 className="text-lg font-bold text-[#F8FAFC]">Ringkasan Pembayaran</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#94A3B8]">Jumlah Tiket</span>
          <span className="font-medium text-[#F8FAFC]">1 tiket</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#94A3B8]">Harga Tiket</span>
          <span className="font-medium text-[#F8FAFC]">
            {formatRupiah(price)}
          </span>
        </div>
      </div>

      <div className="my-5 border-t border-[#1E293B]" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#F8FAFC]">Total</span>
        <span className="text-2xl font-bold text-[#22C55E]">
          {formatRupiah(price)}
        </span>
      </div>

      {isConfirmed ? (
        <Link
          href="/"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      ) : isExpired || isCancelled ? (
        <Link
          href={`/showtimes/${encodeURIComponent(showtimeId)}/seats`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A]"
        >
          Pilih Kursi Lagi
        </Link>
      ) : (
        <>
          <button
            type="button"
            disabled={paying || cancelling}
            onClick={onPay}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-[#0B1120] transition hover:bg-[#16A34A] disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses Pembayaran...
              </>
            ) : (
              `Bayar ${formatRupiah(price)}`
            )}
          </button>

          <button
            type="button"
            disabled={paying || cancelling}
            onClick={onOpenCancel}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#334155] bg-[#1E293B] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:border-[#7A271A] hover:text-white disabled:opacity-60"
          >
            Batalkan Pesanan
          </button>
        </>
      )}

      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#64748B]">
        Pesanan dikonfirmasi setelah pembayaran berhasil.
      </p>
    </aside>
  );
}
