import { normalizeMediaPayload } from './mediaUrl'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export class RequestError extends Error {
  status?: number
  payload?: unknown

  constructor(message: string, options?: { status?: number; payload?: unknown }) {
    super(message)
    this.name = 'RequestError'
    this.status = options?.status
    this.payload = options?.payload
  }
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getApiBaseUrl() {
  const envValue = import.meta.env.VITE_API_BASE_URL?.trim()
  return envValue ? trimTrailingSlash(envValue) : 'http://111.228.49.228:33060'
}

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

function getStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem('threeapp-admin-token') ?? ''
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  if (!token) {
    window.localStorage.removeItem('threeapp-admin-token')
    return
  }

  window.localStorage.setItem('threeapp-admin-token', token)
}

interface RequestOptions extends RequestInit {
  auth?: boolean
}

function normalizeApiErrorMessage(message: string) {
  const categoryMissing = message.match(/^Category\s+(.+)\s+does not exist for\s+(wine|specialty)$/)
  if (categoryMissing) {
    return '后台商品分类尚未初始化，请先检查 product_categories 数据或执行 002_seed.sql 后再保存商品。'
  }

  return message
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers)
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!isFormData && !headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getStoredToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  let payload: unknown = null
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    payload = await response.json()
  } else {
    payload = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? normalizeApiErrorMessage(String((payload as { message?: unknown }).message ?? `Request failed with ${response.status}`))
        : `Request failed with ${response.status}`

    throw new RequestError(message, {
      status: response.status,
      payload,
    })
  }

  if (typeof payload !== 'object' || payload === null || !('code' in payload) || !('data' in payload)) {
    throw new RequestError('Unexpected response format', {
      status: response.status,
      payload,
    })
  }

  return payload as ApiResponse<T>
}

export async function requestData<T>(path: string, options: RequestOptions = {}) {
  const response = await request<T>(path, options)
  return normalizeMediaPayload(response.data)
}

export function getErrorMessage(error: unknown, fallback = '请求失败，请稍后重试。') {
  if (error instanceof RequestError) {
    return error.message || fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}
