// Shared multipart encoding rules for the property/property-draft create+update
// endpoints. Keep this the single source of truth.
//
// amenityKeys/ruleKeys: the backend's DTO transform expects these as repeated
// same-named fields WITHOUT brackets (multer collects them into a real array;
// a JSON-stringified single field arrives as a plain string and fails
// validation) — confirmed against the live create-property endpoint.
//
// removeImageKeys: unlike amenityKeys/ruleKeys, a single bare repeated field
// (no brackets) arrives as a plain string and fails "must be an array" — its
// DTO lacks the same single-value-to-array transform. Two or more bare
// repeated fields DO work, and `key[]` bracket notation works for any count
// (confirmed via direct curl against the live backend) — so this is left to
// fall through to the generic array branch below, which uses `key[]`.
export function appendPropertyFormData(formData: FormData, payload: Record<string, unknown>) {
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // Send parkings as JSON string with proper types
    if (key === 'parkings' && Array.isArray(value)) {
      const normalized = value.map((p) => ({
        type: p.type,
        slots: Number(p.slots),
        isFree: Boolean(p.isFree),
        ...(p.isFree ? {} : { price: Number(p.price) }),
        ...(p.note ? { note: p.note } : {}),
      }))
      formData.append('parkings', JSON.stringify(normalized))
      return
    }

    // Repeated same-named fields, one per numeric id
    if ((key === 'amenityKeys' || key === 'ruleKeys') && Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(Number(item))))
      return
    }

    // Booleans: send as 1/0
    if (key === 'furnished' || key === 'isPublished') {
      formData.append(key, value ? '1' : '0')
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item))
      })
      return
    }

    formData.append(key, String(value))
  })
}
