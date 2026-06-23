import { commentState } from '@/stores/comments'

export function getProductComments(productId: string) {
  return commentState.value.filter((comment) => comment.productId === productId)
}
