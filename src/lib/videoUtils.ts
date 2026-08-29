/**
 * Client-safe video utility for uploaded peer video files
 */
export function formatVideoFileSize(bytes: number): string {
  if (!bytes) return '0 KB';
  if (bytes > 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

export function isValidVideoFile(typeOrName: string): boolean {
  if (!typeOrName) return false;
  if (typeOrName.startsWith('video/')) return true;
  return /\.(mp4|webm|mov|mkv|m4v|avi|ogv)$/i.test(typeOrName);
}
