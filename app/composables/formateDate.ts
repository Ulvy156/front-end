const KM_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
]

export function formatDateLong(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const lang = useCurrentLang().value

  if (lang === 'en') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      numberingSystem: 'latn',
    })
  }

  // Khmer (manual, reliable)
  const day = d.getDate()
  const month = KM_MONTHS[d.getMonth()]
  const year = d.getFullYear()

  return `${day} ${month} ${year}`
}
