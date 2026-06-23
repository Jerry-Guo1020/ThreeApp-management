<script setup lang="ts">
import { Smartphone } from '@lucide/vue'

import type { Product } from '@/data/mockData'

const props = defineProps<{
  product: Product
}>()
</script>

<template>
  <div class="card p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-base font-extrabold text-slate-950">小程序详情页预览</h2>
        <p class="mt-1 text-sm text-slate-500">{{ props.product.name }} · 图片顺序渲染</p>
      </div>
      <Smartphone class="size-5 text-teal-700" />
    </div>

    <div class="mx-auto w-64 rounded-[2rem] bg-slate-950 p-3 shadow-xl">
      <div class="min-h-[430px] overflow-hidden rounded-[1.5rem] bg-white">
        <div class="border-b border-slate-100 px-5 py-4">
          <div class="h-1.5 w-16 rounded-full bg-slate-200" />
          <h3 class="mt-5 text-lg font-extrabold text-slate-950">{{ props.product.name }}</h3>
          <p class="mt-1 text-xs text-slate-500">{{ props.product.subtitle }}</p>
        </div>
        <div class="space-y-3 p-4">
          <div class="h-28 rounded-lg bg-gradient-to-br" :class="props.product.imageTone">
            <div class="flex h-full items-end p-3 text-sm font-bold text-slate-700">商品主图</div>
          </div>
          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-xs leading-5 text-slate-600">{{ props.product.description }}</p>
          </div>
          <div
            v-for="image in props.product.detailImages.filter((item) => item.status === 'visible')"
            :key="image.id"
            class="h-28 rounded-lg bg-gradient-to-br p-3 text-xs font-bold text-slate-700"
            :class="image.tone"
          >
            {{ image.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
