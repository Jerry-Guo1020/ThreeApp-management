<template>
  <span
    class="inline-flex min-h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset"
    :class="toneClass"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { statusLabels, type PublishStatus } from '@/data/mockData'

const props = defineProps<{
  status: PublishStatus | 'pending' | 'replied' | 'visible' | 'hidden'
  label?: string
}>()

const toneClass = computed(() => {
  const tones: Record<string, string> = {
    published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    scheduled: 'bg-sky-50 text-sky-700 ring-sky-200',
    hidden: 'bg-rose-50 text-rose-700 ring-rose-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    replied: 'bg-teal-50 text-teal-700 ring-teal-200',
    visible: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  }

  return tones[props.status] ?? tones.draft
})

const text = computed(() => {
  if (props.label) return props.label
  const labels: Record<string, string> = {
    ...statusLabels,
    pending: '待回复',
    replied: '已回复',
    visible: '展示',
    hidden: '隐藏',
  }

  return labels[props.status] ?? props.status
})
</script>
