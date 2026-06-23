<script setup lang="ts">
import { computed } from 'vue'
import { CalendarDays, Save, X } from '@lucide/vue'

import { getProductsByType, productTypeLabels, type ProductType } from '@/data/mockData'

const props = defineProps<{
  open: boolean
  type: ProductType
}>()

const emit = defineEmits<{
  close: []
}>()

const productOptions = computed(() => getProductsByType(props.type))
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('close')">
    <section class="w-full max-w-xl rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">新增{{ productTypeLabels[props.type] }}更新</h2>
          <p class="text-xs text-slate-500">选择商品、更新类型和展示位置</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-5 p-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">选择商品</label>
            <select class="input-field">
              <option v-for="product in productOptions" :key="product.id">{{ product.name }}</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">更新类型</label>
            <select class="input-field">
              <option>图片 / 文案</option>
              <option>详情图</option>
              <option>场景推荐</option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">更新说明</label>
          <textarea class="input-field min-h-28 resize-none" value="输入这次商品更新信息..." />
        </div>

        <div class="rounded-lg bg-slate-50 p-4">
          <div class="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <CalendarDays class="size-4 text-teal-700" />
            发布设置
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <button class="rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-teal-700 ring-1 ring-teal-200" type="button">立即发布</button>
            <button class="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200" type="button">存草稿</button>
            <button class="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200" type="button">定时发布</button>
          </div>
        </div>
      </div>

      <footer class="flex justify-end gap-3 border-t border-slate-200 p-5">
        <button class="btn-secondary" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary" type="button" @click="emit('close')">
          <Save class="size-4" />
          保存更新
        </button>
      </footer>
    </section>
  </div>
</template>
