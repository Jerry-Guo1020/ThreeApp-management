import { ref } from 'vue'

import type {
  DetailImage,
  Product,
  ProductCategoryOption,
  ProductKeyValueItem,
  ProductSectionItem,
  ProductType,
} from '@/types/product'
import { readStorage, writeStorage } from './persistence'
import {
  getPreviewProductCategories,
  getPreviewProducts,
  isPreviewSessionActive,
} from './preview'
import { getErrorMessage, requestData } from '@/utils/request'

const PRODUCT_STORAGE_KEY = 'threeapp-products'

interface ProductApiItem {
  id?: number | string
  type?: ProductType
  categoryKey?: string
  categoryName?: string
  slug?: string
  title?: string
  subtitle?: string
  description?: string
  brand?: string
  origin?: string
  coverUrl?: string
  badge?: string
  tags?: string[]
  galleryUrls?: string[]
  specs?: ProductKeyValueItem[]
  sections?: ProductSectionItem[]
  status?: number | null
  sort?: number | null
  linkUrl?: string
  reviewCount?: number | null
  reviewSummary?: {
    commentCount?: number | null
  }
}

export interface SaveProductPayload {
  id?: string
  type: ProductType
  title: string
  subtitle: string
  categoryKey: string
  brand: string
  origin: string
  description: string
  badge: string
  tags: string[]
  coverUrl: string
  galleryUrls: string[]
  status: 'published' | 'draft'
  sort: number
  slug?: string
}

export const productState = ref<Product[]>(readStorage<Product[]>(PRODUCT_STORAGE_KEY, []))
export const productLoading = ref(false)
export const productError = ref('')
export const productCategoryState = ref<Record<ProductType, ProductCategoryOption[]>>({
  wine: [],
  specialty: [],
})

function persistProducts() {
  writeStorage(PRODUCT_STORAGE_KEY, productState.value)
}

function applyPreviewProductState(message?: string) {
  productState.value = getPreviewProducts()
  productCategoryState.value = {
    wine: getPreviewProductCategories('wine'),
    specialty: getPreviewProductCategories('specialty'),
  }
  persistProducts()
  if (message) {
    productError.value = message
  }
}

function cloneProduct(product: Product): Product {
  return {
    ...product,
    tags: [...(product.tags ?? [])],
    galleryUrls: [...(product.galleryUrls ?? [])],
    detailImages: product.detailImages.map((image) => ({ ...image })),
    specs: (product.specs ?? []).map((item) => ({ ...item })),
    sections: (product.sections ?? []).map((section) => ({
      ...section,
      extra: section.extra ? { ...section.extra } : undefined,
    })),
  }
}

function cloneProductState() {
  return productState.value.map(cloneProduct)
}

function toPublishStatus(status: number | null | undefined): Product['status'] {
  return Number(status) === 1 ? 'published' : 'draft'
}

function toApiStatus(status: SaveProductPayload['status'] | Product['status']) {
  return status === 'published' ? 1 : 0
}

function getImageTone(type: ProductType) {
  return type === 'specialty' ? 'from-lime-100 to-emerald-200' : 'from-amber-100 to-orange-200'
}

function getDetailTone(type: ProductType, index: number) {
  const wineTones = [
    'from-amber-100 to-orange-200',
    'from-slate-100 to-amber-100',
    'from-rose-100 to-red-100',
    'from-sky-100 to-indigo-100',
  ]
  const specialtyTones = [
    'from-lime-100 to-emerald-200',
    'from-teal-50 to-lime-100',
    'from-amber-50 to-lime-100',
    'from-sky-100 to-emerald-100',
  ]
  const tones = type === 'specialty' ? specialtyTones : wineTones
  return tones[index % tones.length]
}

function buildDetailImages(productId: string, type: ProductType, galleryUrls: string[] = [], existingImages: DetailImage[] = []): DetailImage[] {
  const existingByUrl = new Map(existingImages.filter((image) => image.url).map((image) => [image.url as string, image]))

  return galleryUrls.map((url, index) => {
    const existing = existingByUrl.get(url)
    return {
      id: existing?.id ?? `${productId}-detail-${Date.now()}-${index}`,
      title: existing?.title ?? `详情图 ${String(index + 1).padStart(2, '0')}`,
      status: existing?.status ?? 'visible',
      sort: index + 1,
      tone: existing?.tone ?? getDetailTone(type, index),
      url,
    }
  })
}

function normalizeGalleryUrls(coverUrl: string, galleryUrls: string[] = []) {
  const normalized = Array.from(
    new Set([coverUrl, ...galleryUrls].map((item) => item?.trim()).filter(Boolean)),
  )
  return normalized as string[]
}

function mapProduct(item: ProductApiItem): Product {
  const type = item.type === 'specialty' ? 'specialty' : 'wine'
  const coverUrl = item.coverUrl?.trim() ?? ''
  const galleryUrls = normalizeGalleryUrls(
    coverUrl,
    Array.isArray(item.galleryUrls) ? item.galleryUrls.filter((value): value is string => typeof value === 'string' && value.trim().length > 0) : [],
  )
  const comments = Number(item.reviewSummary?.commentCount ?? item.reviewCount ?? 0)

  return {
    id: String(item.id ?? ''),
    type,
    name: item.title?.trim() || 'null',
    subtitle: item.subtitle?.trim() || 'null',
    category: item.categoryName?.trim() || item.categoryKey?.trim() || 'null',
    categoryKey: item.categoryKey?.trim() || '',
    categoryName: item.categoryName?.trim() || item.categoryKey?.trim() || 'null',
    scene: item.origin?.trim() || item.brand?.trim() || 'null',
    tag: item.badge?.trim() || item.tags?.find((value) => value?.trim())?.trim() || 'null',
    tagTone: type === 'specialty' ? 'teal' : 'amber',
    comments: Number.isFinite(comments) ? comments : 0,
    replies: 0,
    status: toPublishStatus(item.status),
    sort: Number(item.sort ?? 0) || 0,
    imageTone: getImageTone(type),
    description: item.description?.trim() || 'null',
    detailImages: buildDetailImages(String(item.id ?? ''), type, galleryUrls),
    slug: item.slug?.trim() || '',
    brand: item.brand?.trim() || '',
    origin: item.origin?.trim() || '',
    coverUrl,
    badge: item.badge?.trim() || '',
    tags: Array.isArray(item.tags) ? item.tags.map((value) => value?.trim()).filter(Boolean) as string[] : [],
    galleryUrls,
    specs: Array.isArray(item.specs)
      ? item.specs.map((spec) => ({ label: spec.label?.trim() || '', value: spec.value?.trim() || '' })).filter((spec) => spec.label || spec.value)
      : [],
    sections: Array.isArray(item.sections)
      ? item.sections
          .map((section, index) => ({
            sectionKey: section.sectionKey?.trim() || `section_${index + 1}`,
            title: section.title?.trim() || '',
            content: section.content?.trim() || '',
            imageUrl: section.imageUrl?.trim() || undefined,
            extra: section.extra ? { ...section.extra } : undefined,
            sort: Number(section.sort ?? index + 1) || index + 1,
          }))
          .filter((section) => section.title || section.content || section.imageUrl)
      : [],
    linkUrl: item.linkUrl?.trim() || '',
  }
}

function buildProductPayload(payload: SaveProductPayload) {
  const coverUrl = payload.coverUrl.trim()
  const galleryUrls = normalizeGalleryUrls(coverUrl, payload.galleryUrls)

  return {
    type: payload.type,
    categoryKey: payload.categoryKey.trim(),
    slug: payload.slug?.trim() || undefined,
    title: payload.title.trim(),
    subtitle: payload.subtitle.trim(),
    description: payload.description.trim(),
    brand: payload.brand.trim(),
    origin: payload.origin.trim(),
    coverUrl,
    badge: payload.badge.trim() || undefined,
    tags: payload.tags.map((item) => item.trim()).filter(Boolean),
    galleryUrls,
    specs: [],
    sections: [],
    status: toApiStatus(payload.status),
    sort: Number(payload.sort) || 1,
  }
}

function upsertProduct(nextProduct: Product) {
  const index = productState.value.findIndex((item) => item.id === nextProduct.id)
  if (index === -1) {
    productState.value = [...productState.value, nextProduct].sort((left, right) => left.type.localeCompare(right.type) || left.sort - right.sort)
    return
  }

  const nextState = [...productState.value]
  nextState.splice(index, 1, nextProduct)
  productState.value = nextState.sort((left, right) => left.type.localeCompare(right.type) || left.sort - right.sort)
}

function updateProductMedia(product: Product, galleryUrls: string[]) {
  const normalizedGalleryUrls = normalizeGalleryUrls(galleryUrls[0] ?? product.coverUrl ?? '', galleryUrls)
  const coverUrl = normalizedGalleryUrls[0] ?? product.coverUrl ?? ''

  return {
    ...product,
    coverUrl,
    galleryUrls: normalizedGalleryUrls,
    detailImages: buildDetailImages(product.id, product.type, normalizedGalleryUrls, product.detailImages),
  }
}

async function fetchProductDetail(id: string) {
  return requestData<ProductApiItem>(`/api/admin/products/${id}`)
}

export async function fetchProductCategories(type: ProductType) {
  if (isPreviewSessionActive()) {
    const categories = getPreviewProductCategories(type)
    productCategoryState.value = {
      ...productCategoryState.value,
      [type]: categories,
    }
    return categories
  }

  const data = await requestData<Array<{ key?: string; name?: string; type?: ProductType; sort?: number }>>(`/api/product-categories?type=${type}`, {
    auth: false,
  })

  productCategoryState.value = {
    ...productCategoryState.value,
    [type]: Array.isArray(data)
      ? data
          .map((item) => ({
            key: item.key?.trim() || '',
            name: item.name?.trim() || item.key?.trim() || '',
            type: item.type === 'specialty' ? 'specialty' : 'wine',
            sort: Number(item.sort ?? 0) || 0,
          }))
          .filter((item) => item.key)
      : [],
  }

  return productCategoryState.value[type]
}

export function getStoredProductCategories(type: ProductType) {
  return productCategoryState.value[type] ?? []
}

export async function fetchProducts() {
  productLoading.value = true
  productError.value = ''

  if (isPreviewSessionActive()) {
    applyPreviewProductState()
    productLoading.value = false
    return
  }

  try {
    const [wineResponse, specialtyResponse] = await Promise.all([
      requestData<{ items: ProductApiItem[]; total: number }>('/api/admin/products?type=wine'),
      requestData<{ items: ProductApiItem[]; total: number }>('/api/admin/products?type=specialty'),
      fetchProductCategories('wine'),
      fetchProductCategories('specialty'),
    ])

    const listItems = [...wineResponse.items, ...specialtyResponse.items]
    const detailItems = await Promise.all(listItems.map((item) => fetchProductDetail(String(item.id ?? ''))))

    productState.value = detailItems.map(mapProduct).sort((left, right) => left.type.localeCompare(right.type) || left.sort - right.sort)
    persistProducts()
  } catch (error) {
    const message = getErrorMessage(error, '商品数据读取失败，已展示本地预览内容。')
    if (productState.value.length) {
      productError.value = message
    } else {
      applyPreviewProductState(message)
    }
  } finally {
    productLoading.value = false
  }
}

export function getStoredProductsByType(type: ProductType) {
  return productState.value.filter((product) => product.type === type).sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))
}

export function getStoredProductById(id: string) {
  return productState.value.find((product) => product.id === id)
}

export async function saveStoredProduct(payload: SaveProductPayload) {
  if (isPreviewSessionActive()) {
    const existingProduct = payload.id ? getStoredProductById(payload.id) : undefined
    const selectedCategory = getStoredProductCategories(payload.type).find((item) => item.key === payload.categoryKey)
    const resolvedCategoryName = selectedCategory?.name ?? (payload.categoryKey || 'null')
    const nextProduct = updateProductMedia(
      {
        id: payload.id ?? `${payload.type}-${Date.now()}`,
        type: payload.type,
        name: payload.title.trim() || 'null',
        subtitle: payload.subtitle.trim() || 'null',
        category: resolvedCategoryName,
        categoryKey: payload.categoryKey,
        categoryName: resolvedCategoryName,
        scene: payload.origin.trim() || payload.brand.trim() || 'null',
        tag: payload.badge.trim() || payload.tags[0]?.trim() || 'null',
        tagTone: payload.type === 'specialty' ? 'teal' : 'amber',
        comments: existingProduct?.comments ?? 0,
        replies: existingProduct?.replies ?? 0,
        status: payload.status,
        sort: Number(payload.sort) || 1,
        imageTone: existingProduct?.imageTone ?? getImageTone(payload.type),
        description: payload.description.trim() || 'null',
        detailImages: existingProduct?.detailImages ?? [],
        slug: payload.slug?.trim() || existingProduct?.slug || '',
        brand: payload.brand.trim(),
        origin: payload.origin.trim(),
        coverUrl: payload.coverUrl.trim(),
        badge: payload.badge.trim(),
        tags: payload.tags.map((item) => item.trim()).filter(Boolean),
        galleryUrls: payload.galleryUrls.map((item) => item.trim()).filter(Boolean),
        specs: existingProduct?.specs ?? [],
        sections: existingProduct?.sections ?? [],
        linkUrl: existingProduct?.linkUrl ?? '',
      },
      payload.galleryUrls,
    )

    upsertProduct(nextProduct)
    persistProducts()
    return nextProduct
  }

  productError.value = ''
  const body = buildProductPayload(payload)
  const data = payload.id
    ? await requestData<ProductApiItem>(`/api/admin/products/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
    : await requestData<ProductApiItem>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(body),
      })

  const nextProduct = mapProduct(data)
  upsertProduct(nextProduct)
  persistProducts()
  return nextProduct
}

export async function deleteStoredProduct(productId: string) {
  if (isPreviewSessionActive()) {
    productState.value = productState.value.filter((product) => product.id !== productId)
    persistProducts()
    return
  }

  productError.value = ''
  await requestData<{ id: string | number; deleted: boolean }>(`/api/admin/products/${productId}`, {
    method: 'DELETE',
  })

  productState.value = productState.value.filter((product) => product.id !== productId)
  persistProducts()
}

export async function reorderStoredProducts(type: ProductType, fromId: string, toId: string) {
  const orderedProducts = getStoredProductsByType(type)
  const fromIndex = orderedProducts.findIndex((product) => product.id === fromId)
  const toIndex = orderedProducts.findIndex((product) => product.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return orderedProducts

  const previousState = cloneProductState()
  const nextProducts = [...orderedProducts]
  const [movedProduct] = nextProducts.splice(fromIndex, 1)
  nextProducts.splice(toIndex, 0, movedProduct)

  const orderMap = new Map(nextProducts.map((product, index) => [product.id, index + 1]))

  productState.value = productState.value.map((product) => {
    if (product.type !== type) return product
    return { ...product, sort: orderMap.get(product.id) ?? product.sort }
  })
  persistProducts()

  if (isPreviewSessionActive()) {
    return getStoredProductsByType(type)
  }

  try {
    const updatedItems = await Promise.all(
      getStoredProductsByType(type).map((product) =>
        requestData<ProductApiItem>(`/api/admin/products/${product.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort: product.sort }),
        }),
      ),
    )

    const mappedProducts = new Map(updatedItems.map((item) => {
      const mapped = mapProduct(item)
      return [mapped.id, mapped] as const
    }))

    productState.value = productState.value.map((product) => mappedProducts.get(product.id) ?? product)
    persistProducts()
    return getStoredProductsByType(type)
  } catch (error) {
    productState.value = previousState
    persistProducts()
    productError.value = getErrorMessage(error)
    throw error
  }
}

export function reorderProductDetailImages(productId: string, fromId: string, toId: string) {
  const product = getStoredProductById(productId)
  if (!product) return undefined

  const images = [...product.detailImages].sort((a, b) => a.sort - b.sort)
  const fromIndex = images.findIndex((image) => image.id === fromId)
  const toIndex = images.findIndex((image) => image.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return product

  const nextImages = [...images]
  const [movedImage] = nextImages.splice(fromIndex, 1)
  nextImages.splice(toIndex, 0, movedImage)

  const nextProduct = updateProductMedia(
    product,
    nextImages
      .map((image) => image.url?.trim())
      .filter((value): value is string => Boolean(value)),
  )

  productState.value = productState.value.map((item) => (item.id === productId ? nextProduct : item))
  persistProducts()
  return nextProduct
}

export function appendProductDetailImages(productId: string, imageUrls: string[]) {
  const product = getStoredProductById(productId)
  if (!product) return undefined

  const nextProduct = updateProductMedia(product, [...(product.galleryUrls ?? []), ...imageUrls])
  productState.value = productState.value.map((item) => (item.id === productId ? nextProduct : item))
  persistProducts()
  return nextProduct
}

export function removeProductDetailImage(productId: string, imageId: string) {
  const product = getStoredProductById(productId)
  if (!product) return undefined

  const nextProduct = updateProductMedia(
    product,
    product.detailImages
      .filter((image) => image.id !== imageId)
      .map((image) => image.url?.trim())
      .filter((value): value is string => Boolean(value)),
  )

  productState.value = productState.value.map((item) => (item.id === productId ? nextProduct : item))
  persistProducts()
  return nextProduct
}

export async function saveProductDetailImages(productId: string) {
  const product = getStoredProductById(productId)
  if (!product) {
    return { ok: false as const, message: '未找到当前商品，无法保存详情图。' }
  }

  const galleryUrls = (product.galleryUrls ?? []).filter((item) => item.trim())
  const coverUrl = product.coverUrl?.trim() || galleryUrls[0] || ''

  if (!coverUrl) {
    return { ok: false as const, message: '请先为当前商品补充至少一张图片。' }
  }

  try {
    const nextProduct = await saveStoredProduct({
      id: product.id,
      type: product.type,
      title: product.name,
      subtitle: product.subtitle === 'null' ? '' : product.subtitle,
      categoryKey: product.categoryKey ?? '',
      brand: product.brand ?? '',
      origin: product.origin ?? '',
      description: product.description === 'null' ? '' : product.description,
      badge: product.badge ?? '',
      tags: product.tags ?? [],
      coverUrl,
      galleryUrls,
      status: product.status === 'published' ? 'published' : 'draft',
      sort: product.sort,
      slug: product.slug,
    })

    upsertProduct(nextProduct)
    persistProducts()
    return { ok: true as const, message: `已保存 ${nextProduct.name} 的详情图顺序。` }
  } catch (error) {
    productError.value = getErrorMessage(error)
    return { ok: false as const, message: productError.value }
  }
}
