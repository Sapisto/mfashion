const PAYSTACK_BASE = "https://api.paystack.co";
const secret = process.env.PAYSTACK_SECRET_KEY!;

function paystackHeaders() {
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  };
}

export interface PaystackInitPayload {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(
  payload: PaystackInitPayload
): Promise<PaystackInitResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Failed to initialize Paystack transaction");
  }
  return res.json();
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    customer: { email: string };
    metadata?: Record<string, unknown>;
  };
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    { headers: paystackHeaders() }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Failed to verify Paystack transaction");
  }
  return res.json();
}

export function generateReference(orderId: string): string {
  return `aie-${orderId}-${Date.now()}`;
}

export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}
