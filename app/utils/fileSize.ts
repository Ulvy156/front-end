const BYTES_PER_MB = 1024 * 1024

export function exceedsFileSize(file: File, maxSizeMB: number): boolean {
  return file.size > maxSizeMB * BYTES_PER_MB
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < BYTES_PER_MB) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`
}
