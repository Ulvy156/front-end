export function formatDuration(months: number): string {
  const lang = useCurrentLang().value

  if (months < 12) {
    if (lang === 'en') {
      return `${months} month${months > 1 ? 's' : ''}`
    }
    return `${months} ខែ`
  }

  const years = Math.floor(months / 12)

  if (lang === 'en') {
    return `${years} year${years > 1 ? 's' : ''}`
  }
  return `${years} ឆ្នាំ`
}
