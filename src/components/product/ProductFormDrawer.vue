<template>
  <div v-if="props.open" class="fixed inset-0 z-50 flex justify-end bg-slate-950/35" @click.self="emit('close')">
    <aside class="flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">{{ title }}</h2>
          <p class="text-xs text-slate-500">维护商品基础资料、展示信息和图片内容。</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="flex-1 space-y-6 overflow-y-auto p-5">
        <section class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '酒水名称' : '商品标题' }}</label>
            <input v-model="form.title" class="input-field" :placeholder="isWine ? '请输入酒水名称' : '请输入商品标题'" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">副标题</label>
            <input v-model="form.subtitle" class="input-field" placeholder="请输入副标题" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '风味类型' : '分类' }}</label>
              <select v-if="categoryOptions.length" v-model="form.categoryKey" class="input-field">
                <option value="">请选择{{ isWine ? '风味类型' : '商品分类' }}</option>
                <option v-for="option in categoryOptions" :key="option.key" :value="option.key">
                  {{ option.name }}
                </option>
              </select>
              <input
                v-else
                v-model="form.categoryKey"
                class="input-field"
                :placeholder="categoryLoading ? '分类加载中...' : isWine ? '请输入风味类型' : '请输入分类'"
              />
              <p v-if="!categoryLoading && !categoryOptions.length" class="mt-2 text-xs leading-5 text-amber-700">
                当前后台分类为空，新增商品前请先初始化 `product_categories` 数据。
              </p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '使用场景' : '地区 / 产地' }}</label>
              <input v-model="form.origin" class="input-field" :placeholder="isWine ? '例如：商务馈赠' : '例如：广东清远'" />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">品牌</label>
            <input v-model="form.brand" class="input-field" placeholder="请输入品牌名称" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">标签</label>
            <input v-model="form.badge" class="input-field" placeholder="例如：主推 / 热销 / 经典" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">标签组</label>
            <input v-model="form.tagsText" class="input-field" placeholder="多个标签请用中文逗号或英文逗号分隔" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">详情卖点</label>
            <textarea v-model="form.description" class="input-field min-h-24 resize-none" placeholder="请输入商品详情卖点或说明" />
          </div>
        </section>

        <section class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">展示状态</label>
            <select v-model="form.status" class="input-field">
              <option value="published">上架</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">排序</label>
            <input v-model.number="form.sort" class="input-field" type="number" min="1" />
          </div>
        </section>

        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-950">封面图与详情图</h3>
            <ImagePlus class="size-4 text-teal-700" />
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-extrabold text-slate-900">当前封面预览</p>
                <p class="mt-1 text-xs leading-5 text-slate-500">选择图片后先在本地预览，点击最终保存时才会真正上传并写入数据库。</p>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">{{ mediaItems.length }} 张</span>
            </div>

            <div v-if="selectedCoverItem" class="mt-4 flex gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <img :src="selectedCoverItem.previewUrl" :alt="selectedCoverItem.fileName" class="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">封面图</span>
                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-bold ring-1"
                    :class="selectedCoverItem.source === 'local' ? 'bg-sky-50 text-sky-700 ring-sky-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'"
                  >
                    {{ selectedCoverItem.source === 'local' ? '待上传' : '已存在' }}
                  </span>
                </div>
                <p class="mt-3 truncate text-sm font-bold text-slate-900">{{ selectedCoverItem.fileName }}</p>
                <p class="mt-2 break-all text-xs leading-5 text-slate-500">{{ getMediaAddressLabel(selectedCoverItem) }}</p>
              </div>
            </div>
            <p v-else class="mt-4 rounded-xl bg-white px-4 py-3 text-sm leading-6 text-slate-500 ring-1 ring-slate-200">
              还没有选择商品图片。请先上传至少一张图片，再点击保存商品。
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <UploadGrid
              compact
              title="选择封面图"
              hint="本地先预览，保存商品时再上传"
              :multiple="false"
              :selected-names="coverUploadNames"
              @selected="handleCoverSelected"
            />
            <UploadGrid
              compact
              title="选择详情图"
              hint="可多选，保存商品时统一上传"
              :selected-names="galleryUploadNames"
              @selected="handleGallerySelected"
            />
          </div>

          <div v-if="mediaItems.length" class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div
              v-for="(item, index) in mediaItems"
              :key="item.id"
              class="rounded-xl bg-white p-3 ring-1 ring-slate-200"
            >
              <div class="flex gap-3">
                <img :src="item.previewUrl" :alt="item.fileName" class="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">图片 {{ index + 1 }}</p>
                        <span v-if="item.id === coverMediaId" class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                          当前封面
                        </span>
                        <span
                          class="rounded-full px-2 py-0.5 text-[11px] font-bold ring-1"
                          :class="item.source === 'local' ? 'bg-sky-50 text-sky-700 ring-sky-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'"
                        >
                          {{ item.source === 'local' ? '待上传' : '已存在' }}
                        </span>
                      </div>
                      <p class="mt-2 truncate text-sm font-bold text-slate-900">{{ item.fileName }}</p>
                    </div>
                    <button class="text-xs font-bold text-rose-700" type="button" @click="removeMediaItem(item.id)">删除</button>
                  </div>
                  <p class="mt-2 break-all text-xs leading-5 text-slate-500">{{ getMediaAddressLabel(item) }}</p>
                  <button
                    v-if="item.id !== coverMediaId"
                    class="mt-3 text-xs font-bold text-teal-700"
                    type="button"
                    @click="setAsCover(item.id)"
                  >
                    设为封面图
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5">
        <div v-if="props.product" class="flex justify-start">
          <button class="btn-secondary text-rose-700 sm:w-auto" type="button" :disabled="saving || deleting" @click="deleteDialogOpen = true">
            {{ deleting ? '删除中...' : '删除商品' }}
          </button>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button class="btn-secondary sm:w-auto" type="button" :disabled="saving || deleting" @click="emit('close')">取消</button>
          <button class="btn-primary sm:w-auto" type="button" :disabled="saving || deleting || uploading || categoryLoading" @click="handleSubmit">
            <Save class="size-4" />
            {{ submitButtonText }}
          </button>
        </div>
      </footer>

      <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
      <ConfirmDialog
        :open="deleteDialogOpen"
        title="删除商品"
        description="该操作会同步删除数据库中的商品记录。"
        :message="props.product ? `确认删除 ${props.product.name} 吗？删除后不可恢复。` : '确认删除当前商品吗？删除后不可恢复。'"
        confirm-text="确认删除"
        loading-text="删除中..."
        :loading="deleting"
        @cancel="handleCancelDelete"
        @confirm="handleDelete"
      />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ImagePlus, Save, X } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { uploadImage } from '@/api/upload'
import type { Product, ProductCategoryOption, ProductType } from '@/types/product'
import { productTypeLabels } from '@/data/mockData'
import {
  deleteStoredProduct,
  fetchProductCategories,
  getStoredProductCategories,
  getStoredProductsByType,
  saveStoredProduct,
} from '@/stores/products'
import { getErrorMessage } from '@/utils/request'

interface ProductFormState {
  title: string
  subtitle: string
  categoryKey: string
  brand: string
  origin: string
  description: string
  badge: string
  tagsText: string
  status: 'published' | 'draft'
  sort: number
}

interface ProductMediaItem {
  id: string
  source: 'remote' | 'local'
  previewUrl: string
  fileName: string
  remoteUrl?: string
  file?: File
}

const props = withDefaults(
  defineProps<{
    open: boolean
    type: ProductType
    product?: Product | null
  }>(),
  {
    product: null,
  },
)

const emit = defineEmits<{
  close: []
}>()

const form = ref<ProductFormState>(createEmptyForm())
const mediaItems = ref<ProductMediaItem[]>([])
const coverMediaId = ref('')
const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false)
const categoryLoading = ref(false)
const categoryOptions = ref<ProductCategoryOption[]>([])
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')
const deleteDialogOpen = ref(false)

const isWine = computed(() => props.type === 'wine')
const title = computed(() => `${props.product ? '编辑' : '新增'}${productTypeLabels[props.type]}商品`)
const selectedCoverItem = computed(() => mediaItems.value.find((item) => item.id === coverMediaId.value) ?? mediaItems.value[0] ?? null)
const coverUploadNames = computed(() => (selectedCoverItem.value ? [selectedCoverItem.value.fileName] : []))
const galleryUploadNames = computed(() =>
  mediaItems.value.filter((item) => item.id !== selectedCoverItem.value?.id).map((item) => item.fileName),
)
const submitButtonText = computed(() => {
  if (saving.value && uploading.value) return '上传并保存中...'
  if (saving.value) return '保存中...'
  return '保存'
})

function createEmptyForm(): ProductFormState {
  const nextSort = getStoredProductsByType(props.type).length + 1
  return {
    title: '',
    subtitle: '',
    categoryKey: '',
    brand: '',
    origin: '',
    description: '',
    badge: '',
    tagsText: '',
    status: 'draft',
    sort: nextSort,
  }
}

function createFormFromProduct(product: Product | null | undefined): ProductFormState {
  if (!product) {
    return createEmptyForm()
  }

  return {
    title: product.name === 'null' ? '' : product.name,
    subtitle: product.subtitle === 'null' ? '' : product.subtitle,
    categoryKey: product.categoryKey ?? product.categoryName ?? '',
    brand: product.brand ?? '',
    origin: product.origin ?? (product.scene === 'null' ? '' : product.scene),
    description: product.description === 'null' ? '' : product.description,
    badge: product.badge ?? (product.tag === 'null' ? '' : product.tag),
    tagsText: (product.tags ?? []).join(', '),
    status: product.status === 'published' ? 'published' : 'draft',
    sort: product.sort || 1,
  }
}

function openToast(tone: 'success' | 'error', titleText: string, message: string) {
  toastTone.value = tone
  toastTitle.value = titleText
  toastMessage.value = message
  toastOpen.value = true
}

async function loadCategoryOptions() {
  categoryLoading.value = true

  try {
    const loaded = await fetchProductCategories(props.type)
    categoryOptions.value = loaded
  } catch (error) {
    categoryOptions.value = getStoredProductCategories(props.type)
    openToast('error', '分类读取失败', getErrorMessage(error, '商品分类读取失败，请稍后重试。'))
  } finally {
    categoryLoading.value = false
  }
}

function normalizeTags() {
  return form.value.tagsText
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function extractFileName(value: string) {
  const normalizedValue = value.split('?')[0] ?? value
  const lastSegment = normalizedValue.split('/').pop() ?? ''
  if (!lastSegment) return '已上传图片'

  try {
    return decodeURIComponent(lastSegment)
  } catch {
    return lastSegment
  }
}

function createRemoteMediaItem(url: string, index: number): ProductMediaItem {
  const normalizedUrl = url.trim()
  return {
    id: `remote-${index}-${normalizedUrl}`,
    source: 'remote',
    previewUrl: normalizedUrl,
    fileName: extractFileName(normalizedUrl),
    remoteUrl: normalizedUrl,
  }
}

function createLocalMediaItem(file: File): ProductMediaItem {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: 'local',
    previewUrl: URL.createObjectURL(file),
    fileName: file.name,
    file,
  }
}

function releaseLocalMediaItem(item: ProductMediaItem) {
  if (item.source === 'local') {
    URL.revokeObjectURL(item.previewUrl)
  }
}

function replaceMediaItems(items: ProductMediaItem[], nextCoverId = '') {
  mediaItems.value.forEach(releaseLocalMediaItem)
  mediaItems.value = items
  coverMediaId.value = nextCoverId || items[0]?.id || ''
}

function buildMediaItemsFromProduct(product: Product | null | undefined) {
  const urls = Array.from(
    new Set([product?.coverUrl ?? '', ...(product?.galleryUrls ?? [])].map((item) => item.trim()).filter(Boolean)),
  )
  const items = urls.map((url, index) => createRemoteMediaItem(url, index))
  const coverId = items.find((item) => item.remoteUrl === product?.coverUrl?.trim())?.id ?? items[0]?.id ?? ''
  return { items, coverId }
}

function getMediaAddressLabel(item: ProductMediaItem) {
  if (item.source === 'remote') {
    return item.remoteUrl ?? ''
  }
  return '本地待上传，点击保存商品后才会生成正式图片地址。'
}

function moveMediaItemToFront(itemId: string) {
  const currentIndex = mediaItems.value.findIndex((item) => item.id === itemId)
  if (currentIndex <= 0) return

  const nextItems = [...mediaItems.value]
  const [targetItem] = nextItems.splice(currentIndex, 1)
  nextItems.unshift(targetItem)
  mediaItems.value = nextItems
}

function setAsCover(itemId: string) {
  coverMediaId.value = itemId
  moveMediaItemToFront(itemId)
}

function removeMediaItem(itemId: string) {
  const target = mediaItems.value.find((item) => item.id === itemId)
  if (!target) return

  releaseLocalMediaItem(target)
  mediaItems.value = mediaItems.value.filter((item) => item.id !== itemId)
  if (coverMediaId.value === itemId) {
    coverMediaId.value = mediaItems.value[0]?.id ?? ''
  }
}

function handleCoverSelected(_: string[], files: File[] = []) {
  const [file] = files
  if (!file) return

  const nextItem = createLocalMediaItem(file)
  mediaItems.value = [nextItem, ...mediaItems.value]
  coverMediaId.value = nextItem.id
}

function handleGallerySelected(_: string[], files: File[] = []) {
  if (!files.length) return

  const nextItems = files.map(createLocalMediaItem)
  mediaItems.value = [...mediaItems.value, ...nextItems]
  if (!coverMediaId.value) {
    coverMediaId.value = nextItems[0]?.id ?? ''
  }
}

async function resolveMediaUrlsForSubmit() {
  return Promise.all(
    mediaItems.value.map(async (item) => {
      if (item.source === 'remote' && item.remoteUrl) {
        return item.remoteUrl
      }

      if (!item.file) {
        throw new Error('存在未识别的本地图片，请重新选择后再保存。')
      }

      const usage = item.id === coverMediaId.value ? `${props.type}/cover` : `${props.type}/gallery`
      const uploadResult = await uploadImage(item.file, usage)
      return uploadResult.publicUrl
    }),
  )
}

async function handleSubmit() {
  saving.value = true

  try {
    if (!form.value.title.trim()) {
      openToast('error', '保存失败', '请先填写商品标题。')
      return
    }

    if (!categoryOptions.value.length) {
      openToast('error', '保存失败', '后台商品分类为空，请先初始化 product_categories 数据后再保存商品。')
      return
    }

    if (!form.value.categoryKey.trim()) {
      openToast('error', '保存失败', isWine.value ? '请先选择风味类型。' : '请先选择商品分类。')
      return
    }

    if (!mediaItems.value.length) {
      openToast('error', '保存失败', '请先补充商品图片。')
      return
    }

    uploading.value = true
    const resolvedUrls = await resolveMediaUrlsForSubmit()
    const coverIndex = mediaItems.value.findIndex((item) => item.id === coverMediaId.value)
    const coverUrl = resolvedUrls[coverIndex] ?? resolvedUrls[0] ?? ''
    const galleryUrls = [coverUrl, ...resolvedUrls.filter((_, index) => index !== coverIndex)]

    if (!coverUrl) {
      openToast('error', '保存失败', '请先补充商品封面图。')
      return
    }

    await saveStoredProduct({
      id: props.product?.id,
      type: props.type,
      title: form.value.title,
      subtitle: form.value.subtitle,
      category: form.value.categoryKey,
      brand: form.value.brand,
      origin: form.value.origin,
      description: form.value.description,
      badge: form.value.badge,
      tags: normalizeTags(),
      coverUrl,
      galleryUrls,
      status: form.value.status,
      sort: form.value.sort,
      slug: props.product?.slug,
    })

    openToast('success', '保存成功', `${form.value.title.trim()} 已在提交时完成图片上传并同步到后端。`)
    emit('close')
  } catch (error) {
    openToast('error', '保存失败', getErrorMessage(error))
  } finally {
    uploading.value = false
    saving.value = false
  }
}

function handleCancelDelete() {
  if (deleting.value) return
  deleteDialogOpen.value = false
}

async function handleDelete() {
  if (!props.product?.id) return
  deleting.value = true
  try {
    await deleteStoredProduct(props.product.id)
    deleteDialogOpen.value = false
    openToast('success', '删除成功', `${props.product.name} 已从后端移除。`)
    emit('close')
  } catch (error) {
    openToast('error', '删除失败', getErrorMessage(error))
  } finally {
    deleting.value = false
  }
}

watch(
  () => [props.open, props.product, props.type] as const,
  async ([open]) => {
    deleteDialogOpen.value = false

    if (!open) {
      replaceMediaItems([])
      return
    }

    form.value = createFormFromProduct(props.product)
    categoryOptions.value = getStoredProductCategories(props.type)
    const { items, coverId } = buildMediaItemsFromProduct(props.product)
    replaceMediaItems(items, coverId)
    await loadCategoryOptions()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  mediaItems.value.forEach(releaseLocalMediaItem)
})
</script>
