import { getStoredProductsByType } from '@/stores/products'

export function getSpecialtyProducts() {
  return getStoredProductsByType('specialty')
}
