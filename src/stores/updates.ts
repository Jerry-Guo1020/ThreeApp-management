import { ref } from 'vue'

import { readStorage, writeStorage } from './persistence'
import { currentUser } from './user'
import type { ProductType, ProductUpdate } from '@/data/mockData'

const UPDATE_STORAGE_KEY = 'threeapp-updates'

export interface SaveUpdatePayload {
  id?: string
  type: ProductType
  title: string
  description: string
  status: 'published' | 'draft' | 'scheduled'
  scheduledAt?: string
}

export const updateState = ref<ProductUpdate[]>(normalizeUpdates(readStorage<ProductUpdate[]>(UPDATE_STORAGE_KEY, [])))

function persistUpdates() {
  writeStorage(UPDATE_STORAGE_KEY, updateState.value)
}

function normalizeUpdates(list: ProductUpdate[]) {
  const nextList = [...list]

  ;(['wine', 'specialty'] as ProductType[]).forEach((type) => {
    const ordered = nextList
      .filter((item) => item.type === type)
      .sort((left, right) => (left.sort ?? Number.MAX_SAFE_INTEGER) - (right.sort ?? Number.MAX_SAFE_INTEGER))

    ordered.forEach((item, index) => {
      item.sort = index + 1
      item.description = item.description ?? 'null'
      item.scheduledAt = item.scheduledAt ?? ''
    })
  })

  return nextList
}

function formatDateTime(value: string) {
  if (!value) return ''
  return value.replace('T', ' ')
}

function formatNow() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function reindexType(type: ProductType) {
  const ordered = updateState.value.filter((item) => item.type === type).sort((left, right) => left.sort - right.sort)
  const orderMap = new Map(ordered.map((item) => [item.id, indexOfItem(ordered, item.id) + 1]))

  updateState.value = updateState.value.map((item) => {
    if (item.type !== type) return item
    return { ...item, sort: orderMap.get(item.id) ?? item.sort }
  })
}

function indexOfItem(list: ProductUpdate[], id: string) {
  return list.findIndex((item) => item.id === id)
}

export function getStoredUpdatesByType(type: ProductType) {
  return updateState.value.filter((item) => item.type === type).sort((left, right) => left.sort - right.sort)
}

export function getVisibleStoredUpdatesByType(type: ProductType) {
  return getStoredUpdatesByType(type).filter((item) => item.status === 'published').slice(0, 3)
}

export function getVisibleStoredUpdates() {
  return [...updateState.value]
    .filter((item) => item.status === 'published')
    .sort((left, right) => left.date.localeCompare(right.date) * -1)
    .slice(0, 3)
}

export function saveStoredUpdate(payload: SaveUpdatePayload) {
  const title = payload.title.trim()
  const description = payload.description.trim()

  if (!title) {
    return { ok: false as const, message: '请先填写通知标题。' }
  }

  if (!description) {
    return { ok: false as const, message: '请先填写通知内容。' }
  }

  if (payload.status === 'scheduled' && !payload.scheduledAt) {
    return { ok: false as const, message: '请选择定时发布时间。' }
  }

  const operator = currentUser.value?.name ?? '平台管理员'
  const date = payload.status === 'scheduled' && payload.scheduledAt ? formatDateTime(payload.scheduledAt) : formatNow()

  if (payload.id) {
    updateState.value = updateState.value.map((item) => {
      if (item.id !== payload.id) return item

      return {
        ...item,
        title,
        description,
        status: payload.status,
        scheduledAt: payload.scheduledAt ?? '',
        date,
        author: operator,
      }
    })

    persistUpdates()
    return { ok: true as const, message: '通知模板已更新。' }
  }

  const nextSort = getStoredUpdatesByType(payload.type).length + 1
  const nextUpdate: ProductUpdate = {
    id: `update-${Date.now()}`,
    type: payload.type,
    productId: `${payload.type}-notice`,
    title,
    description,
    placement: '首页消息轮播',
    status: payload.status,
    date,
    author: operator,
    sort: nextSort,
    scheduledAt: payload.scheduledAt ?? '',
  }

  updateState.value = [...updateState.value, nextUpdate]
  persistUpdates()
  return { ok: true as const, message: '通知模板已新增。' }
}

export function deleteStoredUpdate(id: string) {
  const target = updateState.value.find((item) => item.id === id)
  if (!target) {
    return { ok: false as const, message: '未找到需要删除的通知。' }
  }

  updateState.value = updateState.value.filter((item) => item.id !== id)
  reindexType(target.type)
  persistUpdates()
  return { ok: true as const, message: '通知模板已删除。' }
}

export function moveStoredUpdate(type: ProductType, id: string, direction: 'up' | 'down') {
  const ordered = getStoredUpdatesByType(type)
  const currentIndex = ordered.findIndex((item) => item.id === id)
  if (currentIndex === -1) return

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= ordered.length) return

  const nextOrdered = [...ordered]
  const [moved] = nextOrdered.splice(currentIndex, 1)
  nextOrdered.splice(targetIndex, 0, moved)

  const orderMap = new Map(nextOrdered.map((item, index) => [item.id, index + 1]))
  updateState.value = updateState.value.map((item) => {
    if (item.type !== type) return item
    return { ...item, sort: orderMap.get(item.id) ?? item.sort }
  })

  persistUpdates()
}
