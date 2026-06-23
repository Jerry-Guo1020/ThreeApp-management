import { getStoredProductsByType } from '@/stores/products'

export function getWineProducts() {
  return getStoredProductsByType('wine')
}
