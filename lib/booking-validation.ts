import { generateSlots, getProviderById } from "./shops"

export type BookingRequest = {
  shopId: string
  providerId: string
  time: string
}

export type BookingValidationResult =
  | { valid: true; data: BookingRequest }
  | { valid: false; error: string }

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

export function validateBookingRequest(input: unknown): BookingValidationResult {
  if (typeof input !== "object" || input === null) {
    return { valid: false, error: "Request body must be a JSON object" }
  }

  const { shopId, providerId, time } = input as Record<string, unknown>

  if (!isNonEmptyString(shopId)) return { valid: false, error: "shopId is required" }
  if (!isNonEmptyString(providerId)) return { valid: false, error: "providerId is required" }
  if (!isNonEmptyString(time)) return { valid: false, error: "time is required" }

  if (!getProviderById(shopId, providerId)) {
    return { valid: false, error: "Unknown shop or provider" }
  }

  if (!generateSlots().includes(time)) {
    return { valid: false, error: "Invalid time slot" }
  }

  return { valid: true, data: { shopId, providerId, time } }
}
