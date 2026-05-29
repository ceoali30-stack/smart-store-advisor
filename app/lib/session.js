import crypto from "crypto";

const secret = process.env.APP_SESSION_SECRET;

export function createMerchantSession(merchantId) {
  const payload = String(merchantId);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifyMerchantSession(sessionValue) {
  if (!sessionValue || !secret) return null;

  const [merchantId, signature] = sessionValue.split(".");

  if (!merchantId || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(merchantId)
    .digest("hex");

  if (signature !== expectedSignature) return null;

  return merchantId;
}
