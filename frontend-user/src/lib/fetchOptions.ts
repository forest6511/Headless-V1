export function getCacheOptions(): RequestInit {
  return process.env.NODE_ENV === 'production'
    ? { next: { revalidate: 3600 } }
    : { cache: 'no-store' }
}
