<template>
  <div
    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-teal-300 hover:bg-teal-50/50"
    :class="compact ? 'min-h-24 p-4' : 'min-h-36 p-6'"
  >
    <input ref="inputRef" class="sr-only" type="file" :accept="props.accept" :multiple="props.multiple" @change="handleFileChange" />

    <div class="mb-3 flex size-11 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
      <ImagePlus class="size-5" />
    </div>
    <p class="text-sm font-bold text-slate-800">{{ title }}</p>
    <p class="mt-1 text-xs text-slate-500">{{ hint }}</p>
    <button class="btn-secondary mt-4 h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" @click="openLocalPicker">
      <Upload class="size-4" />
      本地上传
    </button>
    <p v-if="displayNames.length" class="mt-3 text-xs leading-5 text-slate-500">
      已选择：{{ displayNames.join('、') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ImagePlus, Upload } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    title?: string
    hint?: string
    compact?: boolean
    accept?: string
    multiple?: boolean
    currentLabel?: string
  }>(),
  {
    title: '拖拽上传图片',
    hint: '支持 JPG / PNG / WebP',
    compact: false,
    accept: 'image/*',
    multiple: true,
    currentLabel: '',
  },
)

const emit = defineEmits<{
  selected: [fileNames: string[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const selectedNames = ref<string[]>([])

const displayNames = computed(() => {
  if (selectedNames.value.length > 0) return selectedNames.value
  if (props.currentLabel.trim()) return [props.currentLabel.trim()]
  return []
})

function openLocalPicker() {
  inputRef.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const fileNames = Array.from(target.files ?? []).map((file) => file.name)
  selectedNames.value = fileNames
  emit('selected', fileNames)
}
</script>
