<script setup lang="ts">
import { CircleAlert, CircleCheckBig, X } from '@lucide/vue'

export type ToastTone = 'success' | 'error'

const props = defineProps<{
  open: boolean
  tone: ToastTone
  title: string
  message: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div v-if="props.open" class="fixed bottom-5 right-5 z-[70] w-[min(360px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
      <div class="flex items-start gap-3">
        <div class="mt-0.5 shrink-0">
          <CircleCheckBig v-if="props.tone === 'success'" class="size-5 text-emerald-600" />
          <CircleAlert v-else class="size-5 text-rose-600" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-extrabold text-slate-950">{{ props.title }}</p>
          <p class="mt-1 text-sm leading-6 text-slate-500">{{ props.message }}</p>
        </div>
        <button class="icon-button h-8 w-8 shrink-0" type="button" aria-label="关闭提示" @click="emit('close')">
          <X class="size-4" />
        </button>
      </div>
    </div>
  </transition>
</template>
