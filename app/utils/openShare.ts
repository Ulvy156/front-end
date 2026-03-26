type SocialMedia = 'FB' | 'TG'

export function openShare(
  type: SocialMedia,
  shareUrl: string,
  text?: string
) {
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(text ?? '')

  const mediaUrl: Record<SocialMedia, string> = {
    FB: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    TG: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  }

  window.open(
    mediaUrl[type],
    '_blank',
    'width=600,height=500'
  )
}