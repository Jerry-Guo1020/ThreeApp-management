import { ref } from 'vue'

import { comments as commentSeed, type ProductType } from '@/data/mockData'

import { getStoredProductsByType } from './products'
import { readStorage, writeStorage } from './persistence'

const COMMENT_STORAGE_KEY = 'threeapp-comments'

export const commentState = ref(readStorage(COMMENT_STORAGE_KEY, commentSeed))

function persistComments() {
  writeStorage(COMMENT_STORAGE_KEY, commentState.value)
}

export function getStoredCommentsByProduct(productId: string) {
  return commentState.value.filter((comment) => comment.productId === productId)
}

export function replyToStoredComment(commentId: string, reply: string) {
  commentState.value = commentState.value.map((comment) => (comment.id === commentId ? { ...comment, reply } : comment))
  persistComments()
}

export function togglePinnedStoredComment(productId: string, commentId: string) {
  commentState.value = commentState.value.map((comment) => {
    if (comment.productId !== productId) return comment
    if (comment.id === commentId) return { ...comment, pinned: !comment.pinned }
    return { ...comment, pinned: false }
  })
  persistComments()
}

export function deleteStoredComment(commentId: string) {
  commentState.value = commentState.value.map((comment) => (comment.id === commentId ? { ...comment, deleted: true, pinned: false } : comment))
  persistComments()
}

export function getCommentSummariesByTypeFromStore(type: ProductType) {
  return getStoredProductsByType(type).map((product) => {
    const productComments = commentState.value
      .filter((comment) => comment.productId === product.id && !comment.deleted)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

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
