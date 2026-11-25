import type { Booking, CheckoutContext } from "./types";

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function saveCheckoutContext(key: string, ctx: CheckoutContext): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(`cinora_ctx_${key}`, JSON.stringify(ctx));
  } catch {
    return;
  }
}

export function readCheckoutContext(key: string): CheckoutContext | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(`cinora_ctx_${key}`);
    return raw ? (JSON.parse(raw) as CheckoutContext) : null;
  } catch {
    return null;
  }
}

export function saveDemoBooking(booking: Booking): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(`cinora_demo_booking_${booking.id}`, JSON.stringify(booking));
  } catch {
    return;
  }
}

export function readDemoBooking(bookingId: string): Booking | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(`cinora_demo_booking_${bookingId}`);
    return raw ? (JSON.parse(raw) as Booking) : null;
  } catch {
    return null;
  }
}
