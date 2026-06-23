import { getCommentsByProduct } from '@/data/mockData'

export function getProductComments(productId: string) {
  return getCommentsByProduct(productId)
}
