<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

const props = defineProps<{
  label: string
  icon: FunctionalComponent
  title: string
  danger?: boolean
}>()
</script>

<template>
  <button
    class="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
    :class="props.danger ? 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700' : ''"
    type="button"
    :aria-label="props.label"
  >
    <component :is="props.icon" class="size-4" />
    <span class="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
      {{ props.title }}
    </span>
  </button>
</template>
