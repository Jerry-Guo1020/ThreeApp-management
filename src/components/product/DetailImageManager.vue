<script setup lang="ts">
import { GripVertical, ImagePlus, Trash2 } from '@lucide/vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import type { Product } from '@/data/mockData'

const props = defineProps<{
  product: Product
}>()
</script>

<template>
  <section class="card p-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-lg font-extrabold text-slate-950">详情图配置</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">
          详情介绍统一上传 AI 生成详情长图/详情图，小程序按顺序渲染。
        </p>
      </div>
      <button class="btn-primary shrink-0" type="button">
        <ImagePlus class="size-4" />
        保存详情图
      </button>
    </div>

    <div class="mt-5">
      <UploadGrid title="拖拽上传详情图" hint="建议宽度 750px，支持 JPG / PNG / WebP" />
    </div>

    <div class="mt-5 rounded-lg border border-slate-200 bg-white p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-sm font-extrabold text-slate-950">已上传详情图</h3>
        <span class="text-xs font-bold text-slate-400">{{ props.product.detailImages.length }} 张</span>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="image in props.product.detailImages"
          :key="image.id"
          class="rounded-lg border border-slate-200 bg-slate-50 p-3"
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
            <button class="btn-secondary h-9 min-h-9 flex-1 px-2 text-xs" type="button">
              <GripVertical class="size-4" />
              拖拽排序
            </button>
            <button class="icon-button h-9 w-9 text-rose-600" type="button" aria-label="删除详情图">
              <Trash2 class="size-4" />
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
