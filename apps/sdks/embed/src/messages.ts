import type { LomiCheckoutCompletePayload } from "./utils";
import { LOMI_CHECKOUT_MESSAGE_TYPE } from "./types";

export function getCheckoutOrigin(checkoutUrl: string): string | null {
  try {
    return new URL(checkoutUrl).origin;
  } catch {
    return null;
  }
}

export function isAllowedCheckoutOrigin(
  eventOrigin: string,
  checkoutUrl: string,
): boolean {
  const expected = getCheckoutOrigin(checkoutUrl);
  if (!expected) {
    return true;
  }
  return eventOrigin === expected;
}

export function legacyCompleteToPayload(
  data: Record<string, unknown>,
): LomiCheckoutCompletePayload {
  return {
    type: "LOMI_CHECKOUT_COMPLETE",
    sessionId: (data.sessionId as string | null | undefined) ?? null,
    transactionId: data.transactionId as string | undefined,
    amount: data.amount as number | undefined,
    currency: data.currency as string | undefined,
    hasDigitalDeliverables: data.hasDigitalDeliverables as boolean | undefined,
  };
}

export function parseCheckoutMessage(
  data: unknown,
): { event: string; payload?: LomiCheckoutCompletePayload } | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (record.type === LOMI_CHECKOUT_MESSAGE_TYPE && typeof record.event === "string") {
    if (record.event === "success") {
      return {
        event: "success",
        payload: legacyCompleteToPayload(record),
      };
    }
    if (record.event === "resize") {
      return { event: "resize" };
    }
    return { event: record.event };
  }

  if (record.type === "LOMI_CHECKOUT_COMPLETE") {
    return {
      event: "success",
      payload: legacyCompleteToPayload(record),
    };
  }

  if (record.type === "LOMI_RESIZE") {
    return { event: "resize" };
  }

  return null;
}
