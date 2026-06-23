<script setup lang="ts">
import { Send, X } from '@lucide/vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('close')">
    <section class="w-full max-w-md rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">回复评论</h2>
          <p class="text-xs text-slate-500">二级评论由后台商家回复产生</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-5 p-5">
        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">回复内容</label>
          <textarea class="input-field min-h-32 resize-none" value="感谢认可，后续会继续优化包装防震。" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">操作</label>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200" type="button">置顶</button>
            <button class="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-200" type="button">标记处理</button>
            <button class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-100" type="button">删除评论</button>
          </div>
        </div>
        <div class="rounded-lg bg-rose-50 p-4">
          <p class="text-sm font-extrabold text-rose-900">删除评论确认</p>
          <p class="mt-1 text-sm leading-6 text-rose-700">删除后前台不再展示，可保留后台日志。</p>
        </div>
      </div>

      <footer class="flex justify-end gap-3 border-t border-slate-200 p-5">
        <button class="btn-secondary" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary" type="button" @click="emit('close')">
          <Send class="size-4" />
          提交回复
        </button>
      </footer>
    </section>
  </div>
</template>
