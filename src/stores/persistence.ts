export function cloneSeed<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return cloneSeed(fallback)

  const stored = window.localStorage.getItem(key)
  if (!stored) return cloneSeed(fallback)

  try {
    return JSON.parse(stored) as T
  } catch {
    return cloneSeed(fallback)
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}
