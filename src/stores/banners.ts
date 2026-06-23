import { ref } from 'vue'

import { homeBanners as bannerSeed, type ContentCard } from '@/data/mockData'

import { readStorage, writeStorage } from './persistence'

const BANNER_STORAGE_KEY = 'threeapp-home-banners'

export interface SaveBannerPayload {
  id: string
  title: string
  description: string
  status: 'published' | 'draft' | 'hidden'
  imageName?: string
}

export const bannerState = ref<ContentCard[]>(normalizeBanners(readStorage(BANNER_STORAGE_KEY, bannerSeed)))

function normalizeBanners(list: ContentCard[]) {
  return [...list]
    .sort((left, right) => left.sort - right.sort)
    .map((item, index) => ({
      ...item,
      sort: index + 1,
      imageName: item.imageName ?? `${item.title}.jpg`,
    }))
}

function persistBanners() {
  writeStorage(BANNER_STORAGE_KEY, bannerState.value)
}

export function getStoredBanners() {
  return [...bannerState.value].sort((left, right) => left.sort - right.sort)
}

export function moveStoredBanner(id: string, direction: 'up' | 'down') {
  const ordered = getStoredBanners()
  const currentIndex = ordered.findIndex((item) => item.id === id)
  if (currentIndex === -1) return

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= ordered.length) return

  const nextOrdered = [...ordered]
  const [moved] = nextOrdered.splice(currentIndex, 1)
  nextOrdered.splice(targetIndex, 0, moved)

  bannerState.value = nextOrdered.map((item, index) => ({ ...item, sort: index + 1 }))
  persistBanners()
}

export function saveStoredBanner(payload: SaveBannerPayload) {
  const title = payload.title.trim()
  const description = payload.description.trim()

  if (!title) {
    return { ok: false as const, message: '请先填写 Banner 标题。' }
  }

  if (!description) {
    return { ok: false as const, message: '请先填写 Banner 小标题。' }
  }

  bannerState.value = bannerState.value.map((item) => {
    if (item.id !== payload.id) return item

    return {
      ...item,
      title,
      description,
      status: payload.status,
      imageName: payload.imageName?.trim() || item.imageName,
    }
  })

  persistBanners()
  return { ok: true as const, message: 'Banner 内容已更新。' }
}
