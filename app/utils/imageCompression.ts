export interface CompressedImage {
  file: File
  dataUrl: string
}

// Downscales + re-encodes an image client-side before upload. Full-resolution
// phone photos (often 3-8MB each) were blowing past the ~4.5MB body limit the
// Vercel-proxied /api/property route enforces once a few photos were attached.
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.8,
): Promise<CompressedImage> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Failed to decode image'))
      el.src = objectUrl
    })

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) throw new Error('Image compression produced no data')

    const compressedFile = new File(
      [blob],
      file.name.replace(/\.\w+$/, '.jpg'),
      { type: 'image/jpeg' },
    )

    return { file: compressedFile, dataUrl: canvas.toDataURL('image/jpeg', quality) }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
