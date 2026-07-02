function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function getApiBaseUrl() {
  const envValue = import.meta.env.VITE_API_BASE_URL?.trim()
  return envValue ? trimTrailingSlash(envValue) : 'http://111.228.49.228:33060'
}

function getMinioBucket() {
  return import.meta.env.VITE_MINIO_BUCKET?.trim() || 'threevine'
}

function getMinioProtocol(apiUrl: URL) {
  return import.meta.env.VITE_MINIO_PROTOCOL?.trim() || apiUrl.protocol.replace(/:$/, '')
}

function getMinioPort(protocol: string) {
  const envPort = import.meta.env.VITE_MINIO_PORT?.trim()
  if (envPort) {
    return envPort
  }

  return protocol === 'https' ? '9000' : '9000'
}

export function getMinioPublicBaseUrl() {
  const explicitUrl = import.meta.env.VITE_MINIO_PUBLIC_URL?.trim()
  if (explicitUrl) {
    return trimTrailingSlash(explicitUrl)
  }

  try {
    const apiUrl = new URL(getApiBaseUrl())
    const protocol = getMinioProtocol(apiUrl)
    const host = import.meta.env.VITE_MINIO_HOST?.trim() || apiUrl.hostname
    const port = getMinioPort(protocol)
    const defaultPort = protocol === 'https' ? '443' : '80'
    const portSegment = !port || port === defaultPort ? '' : `:${port}`
    return `${protocol}://${host}${portSegment}/${encodeURIComponent(getMinioBucket())}`
  } catch {
    return `http://111.228.49.228:9000/${encodeURIComponent(getMinioBucket())}`
  }
}

function isLocalMinioHost(hostname: string) {
  const normalizedHost = hostname.trim().toLowerCase()
  return normalizedHost === '127.0.0.1' || normalizedHost === 'localhost' || normalizedHost === '::1'
}

function decodePathSegment(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function normalizeMediaUrl(value: string) {
  const normalizedValue = value.trim()
  if (!/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue
  }

  try {
    const url = new URL(normalizedValue)
    if (!isLocalMinioHost(url.hostname)) {
      return normalizedValue
    }

    const segments = url.pathname.split('/').filter(Boolean).map(decodePathSegment)
    const bucket = getMinioBucket()
    const bucketIndex = segments.indexOf(bucket)
    if (bucketIndex === -1 || bucketIndex === segments.length - 1) {
      return normalizedValue
    }

    const objectKey = segments.slice(bucketIndex + 1).map((segment) => encodeURIComponent(segment)).join('/')
    return `${getMinioPublicBaseUrl()}/${objectKey}`
  } catch {
    return normalizedValue
  }
}

const MEDIA_URL_KEYS = new Set(['coverUrl', 'imageUrl', 'iconUrl', 'storageUrl', 'databaseUrl', 'publicUrl'])
const MEDIA_URL_ARRAY_KEYS = new Set(['galleryUrls'])

export function normalizeMediaPayload<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeMediaUrl(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeMediaPayload(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => {
        if (typeof item === 'string' && MEDIA_URL_KEYS.has(key)) {
          return [key, normalizeMediaUrl(item)]
        }

        if (Array.isArray(item) && MEDIA_URL_ARRAY_KEYS.has(key)) {
          return [key, item.map((entry) => (typeof entry === 'string' ? normalizeMediaUrl(entry) : normalizeMediaPayload(entry)))]
        }

        return [key, normalizeMediaPayload(item)]
      }),
    ) as T
  }

  return value
}
