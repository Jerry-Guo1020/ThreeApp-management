import { normalizeMediaPayload } from '@/utils/mediaUrl'

export function cloneSeed<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const PLACEHOLDER_MEDIA_URL = /^https?:\/\/minio\.example\.com(?:[:/]|$)/i

function stripPlaceholderMediaUrls<T>(value: T): T {
  if (typeof value === 'string') {
    return (PLACEHOLDER_MEDIA_URL.test(value.trim()) ? '' : value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => stripPlaceholderMediaUrls(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, stripPlaceholderMediaUrls(item)]),
    ) as T
  }

  return value
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return cloneSeed(fallback)

  const stored = window.localStorage.getItem(key)
  if (!stored) return cloneSeed(fallback)

  try {
    return normalizeMediaPayload(stripPlaceholderMediaUrls(JSON.parse(stored))) as T
  } catch {
    return cloneSeed(fallback)
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(normalizeMediaPayload(value)))
}

export function removeStorage(key: string) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}
