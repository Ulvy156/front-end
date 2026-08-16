// The Telegram Login Widget's data-auth-url redirect mode builds its query
// string from an object where absent optional fields (last_name, username,
// photo_url) are JS `null` rather than omitted keys — so they arrive here as
// the literal string "null", not as a missing param. A plain truthiness
// check treats that string as a real value, so it must be filtered out here.
export function parseTelegramQueryField(value: unknown): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw || raw === 'null' || raw === 'undefined') return undefined
  return String(raw)
}
