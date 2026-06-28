import {
  comments as mockComments,
  homeBanners as mockHomeBanners,
  products as mockProducts,
  questions as mockQuestions,
  updates as mockUpdates,
  userAccounts as mockUserAccounts,
} from '@/data/mockData'
import type { Product as SeedProduct, ProductType, UserAccount } from '@/data/mockData'
import type { Product, ProductCategoryOption } from '@/types/product'

import { cloneSeed, readStorage, writeStorage } from './persistence'

export type SessionMode = 'remote' | 'preview'

export const PREVIEW_LOGIN_DEFAULTS = {
  username: 'admin',
  password: 'admin123456',
}

const SESSION_MODE_STORAGE_KEY = 'threeapp-session-mode'
const PRODUCT_STORAGE_KEY = 'threeapp-products'
const QUESTION_STORAGE_KEY = 'threeapp-questions'
const COMMENT_STORAGE_KEY = 'threeapp-comments'
const UPDATE_STORAGE_KEY = 'threeapp-updates'
const BANNER_STORAGE_KEY = 'threeapp-home-banners'

const previewImagePalettes: Record<ProductType, { cover: [string, string]; detail: Array<[string, string]> }> = {
  wine: {
    cover: ['#f59e0b', '#f97316'],
    detail: [
      ['#f59e0b', '#fb7185'],
      ['#f8fafc', '#fde68a'],
      ['#fecdd3', '#f97316'],
      ['#bfdbfe', '#818cf8'],
    ],
  },
  specialty: {
    cover: ['#22c55e', '#14b8a6'],
    detail: [
      ['#bbf7d0', '#34d399'],
      ['#ccfbf1', '#bef264'],
      ['#fde68a', '#86efac'],
      ['#bfdbfe', '#6ee7b7'],
    ],
  },
}

export function getStoredSessionMode(): SessionMode {
  if (typeof window === 'undefined') {
    return 'remote'
  }

  return window.localStorage.getItem(SESSION_MODE_STORAGE_KEY) === 'preview' ? 'preview' : 'remote'
}

export function setStoredSessionMode(mode: SessionMode | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!mode || mode === 'remote') {
    window.localStorage.removeItem(SESSION_MODE_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(SESSION_MODE_STORAGE_KEY, mode)
}

export function isPreviewSessionActive() {
  return getStoredSessionMode() === 'preview'
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildPreviewImage(label: string, from: string, to: string) {
  const safeLabel = escapeSvgText(label || 'ThreeApp Preview')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}" />
        <stop offset="100%" stop-color="${to}" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" rx="48" fill="url(#g)" />
    <circle cx="1040" cy="140" r="180" fill="rgba(255,255,255,0.18)" />
    <circle cx="180" cy="680" r="220" fill="rgba(15,23,42,0.08)" />
    <text x="72" y="108" fill="#0f172a" font-family="Arial, sans-serif" font-size="40" font-weight="700">ThreeApp Preview</text>
    <text x="72" y="228" fill="#0f172a" font-family="Arial, sans-serif" font-size="68" font-weight="800">${safeLabel}</text>
  </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function buildPreviewCategoryOptions(type: ProductType): ProductCategoryOption[] {
  return Array.from(new Set(mockProducts.filter((item) => item.type === type).map((item) => item.category)))
    .filter(Boolean)
    .map((name, index) => ({
      key: `${type}-category-${index + 1}`,
      name,
      type,
      sort: index + 1,
    }))
}

const previewCategoryOptions: Record<ProductType, ProductCategoryOption[]> = {
  wine: buildPreviewCategoryOptions('wine'),
  specialty: buildPreviewCategoryOptions('specialty'),
}

function getPreviewCategoryKey(type: ProductType, categoryName: string) {
  return previewCategoryOptions[type].find((item) => item.name === categoryName)?.key ?? ''
}

function buildPreviewDetailImages(product: SeedProduct) {
  const palettes = previewImagePalettes[product.type]

  return product.detailImages.map((image, index) => {
    const [from, to] = palettes.detail[index % palettes.detail.length]
    return {
      ...image,
      url: buildPreviewImage(`${product.name} ${image.title}`, from, to),
    }
  })
}

export function getPreviewProductCategories(type: ProductType) {
  return cloneSeed(previewCategoryOptions[type])
}

export function getPreviewProducts(): Product[] {
  return cloneSeed(
    mockProducts.map((product) => {
      const detailImages = buildPreviewDetailImages(product)
      const [coverFrom, coverTo] = previewImagePalettes[product.type].cover
      const coverUrl = buildPreviewImage(product.name, coverFrom, coverTo)

      return {
        ...product,
        categoryKey: getPreviewCategoryKey(product.type, product.category),
        categoryName: product.category,
        slug: product.id,
        brand: product.name,
        origin: product.scene,
        coverUrl,
        badge: product.tag,
        tags: product.tag && product.tag !== 'null' ? [product.tag] : [],
        galleryUrls: [coverUrl, ...detailImages.map((image) => image.url).filter(Boolean)],
        detailImages,
      }
    }),
  )
}

export function getPreviewQuestions() {
  return cloneSeed(mockQuestions)
}

export function getPreviewComments() {
  return cloneSeed(mockComments)
}

export function getPreviewCommentsByProduct(productId: string) {
  return getPreviewComments().filter((comment) => comment.productId === productId)
}

export function getPreviewUpdates() {
  return cloneSeed(mockUpdates)
}

export function getPreviewBanners() {
  return cloneSeed(mockHomeBanners)
}

export function getPreviewUserAccounts(): UserAccount[] {
  return cloneSeed(mockUserAccounts)
}

function hydrateCollectionIfEmpty<T>(key: string, nextValue: T) {
  const storedValue = readStorage<T | null>(key, null)

  if (storedValue === null) {
    writeStorage(key, nextValue)
    return
  }

  if (Array.isArray(storedValue) && storedValue.length === 0) {
    writeStorage(key, nextValue)
  }
}

export function seedPreviewWorkspace() {
  hydrateCollectionIfEmpty(PRODUCT_STORAGE_KEY, getPreviewProducts())
  hydrateCollectionIfEmpty(QUESTION_STORAGE_KEY, getPreviewQuestions())
  hydrateCollectionIfEmpty(COMMENT_STORAGE_KEY, getPreviewComments())
  hydrateCollectionIfEmpty(UPDATE_STORAGE_KEY, getPreviewUpdates())
  hydrateCollectionIfEmpty(BANNER_STORAGE_KEY, getPreviewBanners())
}
