import { ref } from 'vue'

import type { ContentCard } from '@/data/mockData'
import { readStorage, writeStorage } from './persistence'
import { getErrorMessage, requestData } from '@/utils/request'

const BANNER_STORAGE_KEY = 'threeapp-home-banners'
const BANNER_SECTION_KEY = 'home_banner'
const BANNER_COUNT = 3

interface PageBlockApiItem {
  id?: number | string
  pageKey?: string
  sectionKey?: string
  configKey?: string
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  status?: number | null
  sort?: number | null
}

export interface SaveBannerPayload {
  id: string
  title: string
  description: string
  status: 'published' | 'draft' | 'hidden'
  imageName?: string
}

export const bannerState = ref<ContentCard[]>(readStorage<ContentCard[]>(BANNER_STORAGE_KEY, []))
export const bannerLoading = ref(false)
export const bannerError = ref('')

function persistBanners() {
  writeStorage(BANNER_STORAGE_KEY, bannerState.value)
}

function toStatus(value: number | null | undefined): ContentCard['status'] {
  return Number(value) === 1 ? 'published' : 'draft'
}

function toApiStatus(status: SaveBannerPayload['status'] | ContentCard['status']) {
  return status === 'published' ? 1 : 0
}

function mapBanner(item: PageBlockApiItem): ContentCard {
  return {
    id: String(item.id ?? ''),
    title: item.title?.trim() || 'null',
    description: item.description?.trim() || 'null',
    status: toStatus(item.status),
    sort: Number(item.sort ?? 0) || 0,
    target: item.sectionKey?.trim() || BANNER_SECTION_KEY,
    imageName: item.imageUrl?.trim() || 'null',
  }
}

function getBannerBlocks(items: PageBlockApiItem[]) {
  return items
    .filter((item) => String(item.sectionKey ?? '') === BANNER_SECTION_KEY)
    .sort((left, right) => Number(left.sort ?? 0) - Number(right.sort ?? 0) || Number(left.id ?? 0) - Number(right.id ?? 0))
}

function buildFallbackBanner(index: number): ContentCard {
  return {
    id: `fallback-${BANNER_SECTION_KEY}-${index + 1}`,
    title: `首页轮播图 ${index + 1}`,
    description: '请编辑当前轮播图内容',
    status: 'draft',
    sort: index + 1,
    target: BANNER_SECTION_KEY,
    imageName: '',
  }
}

function ensureThreeBanners(items: ContentCard[]) {
  const next = [...items]
    .sort((left, right) => left.sort - right.sort || left.id.localeCompare(right.id))
    .slice(0, BANNER_COUNT)

  while (next.length < BANNER_COUNT) {
    next.push(buildFallbackBanner(next.length))
  }

  return next.map((item, index) => ({
    ...item,
    target: BANNER_SECTION_KEY,
    sort: index + 1,
  }))
}

async function fetchBannerBlocks() {
  return requestData<{ items: PageBlockApiItem[]; total: number }>('/api/admin/content/page-blocks?pageKey=home')
}

export async function fetchBanners() {
  bannerLoading.value = true
  bannerError.value = ''

  try {
    const data = await fetchBannerBlocks()
    bannerState.value = ensureThreeBanners(getBannerBlocks(data.items).map(mapBanner))
    persistBanners()
  } catch (error) {
    bannerError.value = getErrorMessage(error)
  } finally {
    bannerLoading.value = false
  }
}

export function getStoredBanners() {
  return [...bannerState.value].sort((left, right) => left.sort - right.sort || left.id.localeCompare(right.id))
}

async function syncBanner(item: ContentCard) {
  if (item.id.startsWith('fallback-')) {
    const created = await requestData<PageBlockApiItem>('/api/admin/content/page-blocks', {
      method: 'POST',
      body: JSON.stringify({
        pageKey: 'home',
        sectionKey: BANNER_SECTION_KEY,
        configKey: `${BANNER_SECTION_KEY}_${item.sort}`,
        title: item.title,
        description: item.description,
        imageUrl: item.imageName?.trim() || undefined,
        status: toApiStatus(item.status),
        sort: item.sort,
      }),
    })
    return mapBanner(created)
  }

  const updated = await requestData<PageBlockApiItem>(`/api/admin/content/page-blocks/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: item.title,
      description: item.description,
      imageUrl: item.imageName?.trim() || undefined,
      status: toApiStatus(item.status),
      sort: item.sort,
    }),
  })
  return mapBanner(updated)
}

export async function moveStoredBanner(id: string, direction: 'up' | 'down') {
  const ordered = getStoredBanners()
  const currentIndex = ordered.findIndex((item) => item.id === id)
  if (currentIndex === -1) return ordered

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= ordered.length) return ordered

  const previousState = bannerState.value.map((item) => ({ ...item }))
  const nextOrdered = [...ordered]
  const [moved] = nextOrdered.splice(currentIndex, 1)
  nextOrdered.splice(targetIndex, 0, moved)

  bannerState.value = nextOrdered.map((item, index) => ({ ...item, sort: index + 1, target: BANNER_SECTION_KEY }))
  persistBanners()

  try {
    const updated = await Promise.all(bannerState.value.map((item) => syncBanner(item)))
    bannerState.value = ensureThreeBanners(updated)
    persistBanners()
    return getStoredBanners()
  } catch (error) {
    bannerState.value = previousState
    persistBanners()
    bannerError.value = getErrorMessage(error)
    throw error
  }
}

export async function saveStoredBanner(payload: SaveBannerPayload) {
  const title = payload.title.trim()
  const description = payload.description.trim()

  if (!title) {
    return { ok: false as const, message: '请先填写 Banner 标题。' }
  }

  if (!description) {
    return { ok: false as const, message: '请先填写 Banner 小标题。' }
  }

  const target = bannerState.value.find((item) => item.id === payload.id)
  if (!target) {
    return { ok: false as const, message: '未找到当前 Banner。' }
  }

  const nextBanner: ContentCard = {
    ...target,
    title,
    description,
    status: payload.status,
    imageName: payload.imageName?.trim() || target.imageName,
    target: BANNER_SECTION_KEY,
  }

  try {
    const synced = await syncBanner(nextBanner)
    bannerState.value = bannerState.value.map((item) => (item.id === payload.id ? synced : item))
    bannerState.value = ensureThreeBanners(bannerState.value)
    persistBanners()
    return { ok: true as const, message: 'Banner 内容已更新。' }
  } catch (error) {
    bannerError.value = getErrorMessage(error)
    return { ok: false as const, message: bannerError.value }
  }
}
