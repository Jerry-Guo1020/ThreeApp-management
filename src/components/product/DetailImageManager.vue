<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GripVertical, ImagePlus, Trash2 } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import type { Product } from '@/data/mockData'
import { removeProductDetailImage, reorderProductDetailImages, saveProductDetailImages } from '@/stores/products'

const props = defineProps<{
  product: Product
}>()

const draggingId = ref<string | null>(null)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')
const localProduct = ref<Product>(props.product)

watch(
  () => props.product,
  (value) => {
    localProduct.value = value
  },
  { immediate: true },
)

const orderedImages = computed(() => [...localProduct.value.detailImages].sort((a, b) => a.sort - b.sort))

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function handleDragStart(imageId: string) {
  draggingId.value = imageId
}

function handleDrop(targetId: string) {
  if (!draggingId.value) return
  const nextProduct = reorderProductDetailImages(localProduct.value.id, draggingId.value, targetId)
  if (nextProduct) {
    localProduct.value = nextProduct
  }
  draggingId.value = null
}

function handleRemove(imageId: string) {
  const nextProduct = removeProductDetailImage(localProduct.value.id, imageId)
  if (!nextProduct) {
    openToast('error', '删除失败', '当前详情图无法删除，请稍后重试。')
    return
  }

  localProduct.value = nextProduct
  openToast('success', '删除成功', '详情图已从当前商品中移除。')
}

function handleSave() {
  const result = saveProductDetailImages(localProduct.value.id)
  openToast(result.ok ? 'success' : 'error', result.ok ? '保存成功' : '保存失败', result.message)
}
</script>

<template>
  <section class="card p-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-extrabold text-slate-950">详情图配置</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">详情页预览统一按图片顺序拼接展示，不额外叠加文字内容。</p>
      </div>
      <button class="btn-primary shrink-0 sm:w-auto" type="button" @click="handleSave">
        <ImagePlus class="size-4" />
        保存详情图配置
      </button>
    </div>

    <div class="mt-5">
      <UploadGrid title="拖拽上传详情图" hint="建议宽度 750px，支持 JPG / PNG / WebP" />
    </div>

    <div class="mt-5 rounded-lg border border-slate-200 bg-white p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-sm font-extrabold text-slate-950">已上传详情图</h3>
        <span class="text-xs font-bold text-slate-400">{{ orderedImages.length }} 张</span>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="image in orderedImages"
          :key="image.id"
          class="rounded-lg border border-slate-200 bg-slate-50 p-3"
          :class="draggingId === image.id ? 'opacity-60' : ''"
          @dragover.prevent
          @drop.prevent="handleDrop(image.id)"
        >
          <div class="h-24 rounded-lg bg-gradient-to-br" :class="image.tone" />
          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-extrabold text-slate-900">{{ image.title }}</p>
              <p class="text-xs text-slate-500">排序 {{ image.sort }}</p>
            </div>
            <StatusBadge :status="image.status" />
          </div>
          <div class="mt-3 flex gap-2">
            <button
              class="btn-secondary h-9 min-h-9 flex-1 px-2 text-xs"
              type="button"
              draggable="true"
              aria-label="拖拽排序详情图"
              @dragstart="handleDragStart(image.id)"
              @dragend="draggingId = null"
            >
              <GripVertical class="size-4" />
              拖拽排序
            </button>
            <button class="icon-button h-9 w-9 text-rose-600" type="button" aria-label="删除详情图" @click="handleRemove(image.id)">
              <Trash2 class="size-4" />
            </button>
          </div>
        </article>
      </div>
    </div>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </section>
</template>
