<template>
  <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('cancel')">
    <section class="w-full max-w-md rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">{{ props.title }}</h2>
          <p v-if="props.description" class="text-xs text-slate-500">{{ props.description }}</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" :disabled="props.loading" @click="emit('cancel')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-3 p-5">
        <p class="text-sm leading-6 text-slate-600">{{ props.message }}</p>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
        <button class="btn-secondary sm:w-auto" type="button" :disabled="props.loading" @click="emit('cancel')">
          {{ props.cancelText }}
        </button>
        <button class="btn-secondary text-rose-700 sm:w-auto" type="button" :disabled="props.loading" @click="emit('confirm')">
          {{ props.loading ? props.loadingText : props.confirmText }}
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    message: string
    confirmText?: string
    cancelText?: string
    loadingText?: string
    loading?: boolean
  }>(),
  {
    title: '确认操作',
    description: '',
    confirmText: '确认',
    cancelText: '取消',
    loadingText: '处理中...',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
