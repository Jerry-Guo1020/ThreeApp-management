import { ref } from 'vue'

import { products as productSeed, type Product, type ProductType } from '@/data/mockData'

import { readStorage, writeStorage } from './persistence'

const PRODUCT_STORAGE_KEY = 'threeapp-products'

export const productState = ref<Product[]>(readStorage(PRODUCT_STORAGE_KEY, productSeed))

function persistProducts() {
  writeStorage(PRODUCT_STORAGE_KEY, productState.value)
}

export function getStoredProductsByType(type: ProductType) {
  return productState.value.filter((product) => product.type === type).sort((a, b) => a.sort - b.sort)
}

export function getStoredProductById(id: string) {
  return productState.value.find((product) => product.id === id)
}

export function reorderStoredProducts(type: ProductType, fromId: string, toId: string) {
  const orderedProducts = getStoredProductsByType(type)
  const fromIndex = orderedProducts.findIndex((product) => product.id === fromId)
  const toIndex = orderedProducts.findIndex((product) => product.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return orderedProducts

  const nextProducts = [...orderedProducts]
  const [movedProduct] = nextProducts.splice(fromIndex, 1)
  nextProducts.splice(toIndex, 0, movedProduct)

  const orderMap = new Map(nextProducts.map((product, index) => [product.id, index + 1]))

  productState.value = productState.value.map((product) => {
    if (product.type !== type) return product
    return { ...product, sort: orderMap.get(product.id) ?? product.sort }
  })

  persistProducts()
  return getStoredProductsByType(type)
}
