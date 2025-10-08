type CacheEntry = { value: any; expiresAt: number }

const CACHE: Map<string, CacheEntry> = new Map()

export function getCache(key: string) {
  const e = CACHE.get(key)
  if (!e) return null
  if (Date.now() > e.expiresAt) {
    CACHE.delete(key)
    return null
  }
  return e.value
}

export function setCache(key: string, value: any, ttlMs = 30_000) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlMs })
}
