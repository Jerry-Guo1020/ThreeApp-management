import { ref } from 'vue'

import type { ProductType } from '@/data/mockData'
import type { CommentItem, CommentSummary } from '@/types/comment'
import { getStoredProductsByType } from './products'
import { readStorage, writeStorage } from './persistence'
import { getPreviewCommentsByProduct, isPreviewSessionActive } from './preview'
import { getErrorMessage, requestData } from '@/utils/request'

interface ReviewApiItem {
  id?: number | string
  nickname?: string
  score?: number
  createdAt?: string
  content?: string
  images?: string[]
  replyContent?: string
  isPinned?: boolean
  deleted?: boolean
}

interface ReviewSummaryApi {
  commentCount?: number
}

const COMMENT_STORAGE_KEY = 'threeapp-comments'

export const commentState = ref<CommentItem[]>(readStorage<CommentItem[]>(COMMENT_STORAGE_KEY, []))
export const commentLoading = ref(false)
export const commentError = ref('')

function persistComments() {
  writeStorage(COMMENT_STORAGE_KEY, commentState.value)
}

function mapComment(productId: string, item: ReviewApiItem): CommentItem {
  return {
    id: String(item.id ?? ''),
    productId,
    author: item.nickname?.trim() || 'null',
    rating: Number(item.score ?? 0) || 0,
    createdAt: item.createdAt?.trim() || 'null',
    content: item.content?.trim() || 'null',
    images: Array.isArray(item.images) ? item.images.length : 0,
    pinned: Boolean(item.isPinned),
    deleted: Boolean(item.deleted),
    reply: item.replyContent?.trim() || '',
  }
}

export async function fetchCommentsForProduct(productId: string) {
  commentLoading.value = true
  commentError.value = ''

  if (isPreviewSessionActive()) {
    const nextComments = getPreviewCommentsByProduct(productId)
    commentState.value = [
      ...commentState.value.filter((comment) => comment.productId !== productId),
      ...nextComments,
    ]
    persistComments()
    commentLoading.value = false
    return {
      items: nextComments,
      total: nextComments.filter((comment) => !comment.deleted).length,
    }
  }

  try {
    const data = await requestData<{ summary?: ReviewSummaryApi; items: ReviewApiItem[] }>(`/api/admin/reviews/products/${productId}`)
    const nextComments = Array.isArray(data.items) ? data.items.map((item) => mapComment(productId, item)) : []
    commentState.value = [
      ...commentState.value.filter((comment) => comment.productId !== productId),
      ...nextComments,
    ]
    persistComments()
    return {
      items: nextComments,
      total: Number(data.summary?.commentCount ?? nextComments.length ?? 0) || 0,
    }
  } catch (error) {
    const message = getErrorMessage(error, '评论数据读取失败，已展示本地预览内容。')
    const fallbackComments = getPreviewCommentsByProduct(productId)
    commentState.value = [
      ...commentState.value.filter((comment) => comment.productId !== productId),
      ...fallbackComments,
    ]
    persistComments()
    commentError.value = message
    return {
      items: fallbackComments,
      total: fallbackComments.filter((comment) => !comment.deleted).length,
    }
  } finally {
    commentLoading.value = false
  }
}

export function getStoredCommentsByProduct(productId: string) {
  return commentState.value.filter((comment) => comment.productId === productId)
}

export async function replyToStoredComment(commentId: string, reply: string) {
  if (isPreviewSessionActive()) {
    commentState.value = commentState.value.map((comment) => {
      if (comment.id !== commentId) return comment
      return {
        ...comment,
        reply,
      }
    })
    persistComments()
    return
  }

  const data = await requestData<ReviewApiItem>(`/api/admin/reviews/${commentId}/reply`, {
    method: 'PATCH',
    body: JSON.stringify({ replyContent: reply }),
  })

  commentState.value = commentState.value.map((comment) => {
    if (comment.id !== commentId) return comment
    return mapComment(comment.productId, data)
  })
  persistComments()
}

export async function togglePinnedStoredComment(productId: string, commentId: string) {
  if (isPreviewSessionActive()) {
    commentState.value = commentState.value.map((comment) => {
      if (comment.productId !== productId) return comment
      if (comment.id !== commentId) return { ...comment, pinned: false }
      return { ...comment, pinned: !comment.pinned }
    })
    persistComments()
    return
  }

  const current = commentState.value.find((comment) => comment.id === commentId)
  const data = await requestData<ReviewApiItem>(`/api/admin/reviews/${commentId}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ isPinned: !current?.pinned }),
  })

  commentState.value = commentState.value.map((comment) => {
    if (comment.productId !== productId) return comment
    if (comment.id !== commentId) return { ...comment, pinned: false }
    return mapComment(productId, data)
  })
  persistComments()
}

export async function deleteStoredComment(commentId: string) {
  if (isPreviewSessionActive()) {
    commentState.value = commentState.value.map((comment) => (comment.id === commentId ? { ...comment, deleted: true, pinned: false } : comment))
    persistComments()
    return
  }

  await requestData<{ id: string | number; deleted: boolean }>(`/api/admin/reviews/${commentId}`, {
    method: 'DELETE',
  })

  commentState.value = commentState.value.map((comment) => (comment.id === commentId ? { ...comment, deleted: true, pinned: false } : comment))
  persistComments()
}

export function getCommentSummariesByTypeFromStore(type: ProductType): CommentSummary[] {
  return getStoredProductsByType(type).map((product) => {
    const productComments = commentState.value
      .filter((comment) => comment.productId === product.id && !comment.deleted)
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))

    const repliedCount = productComments.filter((comment) => comment.reply).length
    const pendingCount = productComments.filter((comment) => !comment.reply).length
    const latestComment = productComments[0]

    return {
      productId: product.id,
      productName: product.name,
      type: product.type,
      total: productComments.length,
      secondLevel: repliedCount,
      flagged: pendingCount,
      lastAt: latestComment ? `最近评论 ${latestComment.createdAt}` : '暂无评论',
    }
  })
}
