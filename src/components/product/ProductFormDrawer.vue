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
              <select v-model="form.categoryKey" class="input-field">
                <option value="">请选择分类</option>
                <option v-for="item in categories" :key="item.key" :value="item.key">{{ item.name }}</option>
              </select>
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

          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">封面图地址</label>
            <input v-model="form.coverUrl" class="input-field" placeholder="请输入封面图地址" />
          </div>
          <UploadGrid compact title="上传封面图" hint="当前会生成可保存的演示图片地址" :multiple="false" :current-label="form.coverUrl" @selected="handleCoverSelected" />

          <div class="mt-3">
            <label class="mb-2 block text-sm font-bold text-slate-700">详情图地址</label>
            <UploadGrid compact title="上传详情图" hint="可一次选择多张图片，当前会生成演示地址" :current-label="`${form.galleryUrls.length} 张`" @selected="handleGallerySelected" />
          </div>

          <div class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3" v-if="form.galleryUrls.length">
            <div v-for="(url, index) in form.galleryUrls" :key="`${url}-${index}`" class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">详情图 {{ index + 1 }}</p>
                  <p class="mt-2 break-all text-sm text-slate-600">{{ url }}</p>
                </div>
                <button class="text-xs font-bold text-rose-700" type="button" @click="removeGalleryUrl(index)">删除</button>
              </div>
              <button v-if="index !== 0" class="mt-3 text-xs font-bold text-teal-700" type="button" @click="setAsCover(url)">
                设为封面图
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5">
        <div v-if="props.product" class="flex justify-start">
          <button class="btn-secondary text-rose-700 sm:w-auto" type="button" :disabled="saving || deleting" @click="handleDelete">
            {{ deleting ? '删除中...' : '删除商品' }}
          </button>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button class="btn-secondary sm:w-auto" type="button" :disabled="saving || deleting" @click="emit('close')">取消</button>
          <button class="btn-primary sm:w-auto" type="button" :disabled="saving || deleting" @click="handleSubmit">
            <Save class="size-4" />
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </footer>

      <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ImagePlus, Save, X } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { mockUpload } from '@/api/upload'
import type { Product, ProductType } from '@/types/product'
import { productTypeLabels } from '@/data/mockData'
import { deleteStoredProduct, fetchProductCategories, getStoredProductCategories, getStoredProductsByType, saveStoredProduct } from '@/stores/products'
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
  coverUrl: string
  galleryUrls: string[]
  status: 'published' | 'draft'
  sort: number
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
const saving = ref(false)
const deleting = ref(false)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

const isWine = computed(() => props.type === 'wine')
const title = computed(() => `${props.product ? '编辑' : '新增'}${productTypeLabels[props.type]}商品`)
const categories = computed(() => getStoredProductCategories(props.type))

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
    coverUrl: '',
    galleryUrls: [],
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
    categoryKey: product.categoryKey ?? '',
    brand: product.brand ?? '',
    origin: product.origin ?? (product.scene === 'null' ? '' : product.scene),
    description: product.description === 'null' ? '' : product.description,
    badge: product.badge ?? (product.tag === 'null' ? '' : product.tag),
    tagsText: (product.tags ?? []).join(', '),
    coverUrl: product.coverUrl ?? '',
    galleryUrls: [...(product.galleryUrls ?? [])],
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

function normalizeGalleryUrls() {
  return Array.from(new Set([form.value.coverUrl, ...form.value.galleryUrls].map((item) => item.trim()).filter(Boolean)))
}

function normalizeTags() {
  return form.value.tagsText
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function setAsCover(url: string) {
  form.value.coverUrl = url
  form.value.galleryUrls = [url, ...form.value.galleryUrls.filter((item) => item !== url)]
}

function removeGalleryUrl(index: number) {
  const removed = form.value.galleryUrls[index]
  form.value.galleryUrls = form.value.galleryUrls.filter((_, currentIndex) => currentIndex !== index)
  if (removed && removed === form.value.coverUrl) {
    form.value.coverUrl = form.value.galleryUrls[0] ?? ''
  }
}

function handleCoverSelected(fileNames: string[]) {
  const [fileName] = fileNames
  if (!fileName) return

  const uploadResult = mockUpload(fileName)
  form.value.coverUrl = uploadResult.url
  setAsCover(uploadResult.url)
}

function handleGallerySelected(fileNames: string[]) {
  if (!fileNames.length) return

  const nextUrls = fileNames.map((fileName) => mockUpload(fileName).url)
  form.value.galleryUrls = Array.from(new Set([...form.value.galleryUrls, ...nextUrls]))
  if (!form.value.coverUrl) {
    form.value.coverUrl = form.value.galleryUrls[0] ?? ''
  }
}

async function ensureCategories() {
  try {
    await fetchProductCategories(props.type)
    if (!form.value.categoryKey) {
      form.value.categoryKey = categories.value[0]?.key ?? ''
    }
  } catch (error) {
    openToast('error', '分类读取失败', getErrorMessage(error))
  }
}

async function handleSubmit() {
  saving.value = true

  try {
    const galleryUrls = normalizeGalleryUrls()
    const coverUrl = form.value.coverUrl.trim() || galleryUrls[0] || ''

    if (!form.value.title.trim()) {
      openToast('error', '保存失败', '请先填写商品标题。')
      return
    }

    if (!form.value.categoryKey.trim()) {
      openToast('error', '保存失败', '请先选择商品分类。')
      return
    }

    if (!coverUrl) {
      openToast('error', '保存失败', '请先补充商品封面图。')
      return
    }

    await saveStoredProduct({
      id: props.product?.id,
      type: props.type,
      title: form.value.title,
      subtitle: form.value.subtitle,
      categoryKey: form.value.categoryKey,
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

    openToast('success', '保存成功', `${form.value.title.trim()} 已同步到后端。`)
    emit('close')
  } catch (error) {
    openToast('error', '保存失败', getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.product?.id) return
  if (typeof window !== 'undefined' && !window.confirm(`确认删除 ${props.product.name} 吗？`)) {
    return
  }

  deleting.value = true
  try {
    await deleteStoredProduct(props.product.id)
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
  ([open]) => {
    if (!open) return
    form.value = createFormFromProduct(props.product)
    void ensureCategories()
  },
  { immediate: true },
)
</script>
