import { ref } from 'vue'

import { products as productSeed, type DetailImage, type Product, type ProductType } from '@/data/mockData'

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

export function reorderProductDetailImages(productId: string, fromId: string, toId: string) {
  const product = getStoredProductById(productId)
  if (!product) return undefined

  const images = [...product.detailImages].sort((a, b) => a.sort - b.sort)
  const fromIndex = images.findIndex((image) => image.id === fromId)
  const toIndex = images.findIndex((image) => image.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return product

  const [movedImage] = images.splice(fromIndex, 1)
  images.splice(toIndex, 0, movedImage)

  const nextImages: DetailImage[] = images.map((image, index) => ({
    ...image,
    sort: index + 1,
  }))

  productState.value = productState.value.map((item) => (item.id === productId ? { ...item, detailImages: nextImages } : item))
  persistProducts()
  return getStoredProductById(productId)
}

export function removeProductDetailImage(productId: string, imageId: string) {
  const product = getStoredProductById(productId)
  if (!product) return undefined

  const nextImages = product.detailImages
    .filter((image) => image.id !== imageId)
    .sort((a, b) => a.sort - b.sort)
    .map((image, index) => ({ ...image, sort: index + 1 }))

  productState.value = productState.value.map((item) => (item.id === productId ? { ...item, detailImages: nextImages } : item))
  persistProducts()
  return getStoredProductById(productId)
}

export function saveProductDetailImages(productId: string) {
  const product = getStoredProductById(productId)
  if (!product) {
    return { ok: false as const, message: '未找到当前商品，无法保存详情图。' }
  }

  persistProducts()
  return { ok: true as const, message: `已保存 ${product.name} 的详情图顺序与展示状态。` }
}
