import { getVisibleStoredUpdates } from '@/stores/updates'

export function getProductUpdates() {
  return getVisibleStoredUpdates()
}
