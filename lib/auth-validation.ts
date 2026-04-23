export type FieldResult = { valid: true } | { valid: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6
const MIN_NAME_LENGTH = 2

export function validateEmail(email: string): FieldResult {
  if (!email) return { valid: false, error: "Email is required" }
  if (!EMAIL_PATTERN.test(email)) return { valid: false, error: "Please enter a valid email address" }
  return { valid: true }
}

export function validatePassword(password: string): FieldResult {
  if (!password) return { valid: false, error: "Password is required" }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }
  }
  return { valid: true }
}

export function validateName(name: string): FieldResult {
  if (!name || name.trim().length < MIN_NAME_LENGTH) {
    return { valid: false, error: `Name must be at least ${MIN_NAME_LENGTH} characters` }
  }
  return { valid: true }
}
