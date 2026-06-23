<script setup lang="ts">
import { ImagePlus, Upload } from '@lucide/vue'

withDefaults(
  defineProps<{
    title?: string
    hint?: string
    compact?: boolean
  }>(),
  {
    title: '拖拽上传图片',
    hint: '支持 JPG / PNG / WebP',
    compact: false,
  },
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-teal-300 hover:bg-teal-50/50"
    :class="compact ? 'min-h-24 p-4' : 'min-h-36 p-6'"
  >
    <div class="mb-3 flex size-11 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
      <ImagePlus class="size-5" />
    </div>
    <p class="text-sm font-bold text-slate-800">{{ title }}</p>
    <p class="mt-1 text-xs text-slate-500">{{ hint }}</p>
    <button class="btn-secondary mt-4 h-9 min-h-9 px-3 text-xs" type="button">
      <Upload class="size-4" />
      选择文件
    </button>
  </div>
</template>
