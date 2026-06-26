import type {
  DetailImage as BaseDetailImage,
  Product as BaseProduct,
  ProductType,
  PublishStatus,
} from '@/data/mockData'

export type { ProductType, PublishStatus }

export interface ProductCategoryOption {
  key: string
  name: string
  type: ProductType
  sort?: number
}

export interface ProductKeyValueItem {
  label: string
  value: string
}

export interface ProductSectionItem {
  sectionKey: string
  title: string
  content: string
  imageUrl?: string
  extra?: Record<string, unknown>
  sort: number
}

export interface DetailImage extends BaseDetailImage {
  url?: string
}

export interface Product extends Omit<BaseProduct, 'detailImages'> {
  detailImages: DetailImage[]
  categoryKey?: string
  categoryName?: string
  slug?: string
  brand?: string
  origin?: string
  coverUrl?: string
  badge?: string
  tags?: string[]
  galleryUrls?: string[]
  specs?: ProductKeyValueItem[]
  sections?: ProductSectionItem[]
  linkUrl?: string
}
