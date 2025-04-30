// lib/imageUtils.ts

export function getSafeImageUrl(url: string): string {
    if (!url) return '/images/default-placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/images/${url.replace(/^\/+/, '')}`;
  }
  