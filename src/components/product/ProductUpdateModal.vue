<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CalendarDays, Save, X } from '@lucide/vue'

import type { ProductUpdate, ProductType } from '@/data/mockData'
import type { SaveUpdatePayload } from '@/stores/updates'

const props = defineProps<{
  open: boolean
  type: ProductType
  update?: ProductUpdate | null
}>()

const emit = defineEmits<{
  close: []
  save: [payload: SaveUpdatePayload]
}>()

const title = ref('')
const description = ref('')
const publishMode = ref<'published' | 'draft' | 'scheduled'>('published')
const scheduledAt = ref('')

const isEditing = computed(() => Boolean(props.update))
const modalTitle = computed(() => `${isEditing.value ? '编辑' : '新增'}${props.type === 'wine' ? '酒水' : '特产'}通知`)
const saveButtonLabel = computed(() => {
  if (publishMode.value === 'draft') return '保存草稿'
  if (publishMode.value === 'scheduled') return '保存定时通知'
  return '立即发布'
})

watch(
  () => [props.open, props.type, props.update] as const,
  () => {
    title.value = props.update?.title ?? ''
    description.value = props.update?.description ?? ''
    publishMode.value = (props.update?.status === 'hidden' ? 'draft' : props.update?.status ?? 'published') as 'published' | 'draft' | 'scheduled'
    scheduledAt.value = props.update?.scheduledAt ?? ''
  },
  { immediate: true },
)

function submit() {
  emit('save', {
    id: props.update?.id,
    type: props.type,
    title: title.value,
    description: description.value,
    status: publishMode.value,
    scheduledAt: scheduledAt.value,
  })
}
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('close')">
    <section class="w-full max-w-xl rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">{{ modalTitle }}</h2>
          <p class="text-xs text-slate-500">首页轮播文字最多展示 3 条已发布通知，按当前顺序取前 3 条。</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-5 p-5">
        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">通知标题</label>
          <input v-model="title" class="input-field" placeholder="例如：首页通知：酒水礼盒图片已更新" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">通知内容</label>
          <textarea
            v-model="description"
            class="input-field min-h-28 resize-none"
            placeholder="填写轮播通知展示的文字内容，方便在首页提示用户最新变化。"
          />
        </div>

        <div class="rounded-lg bg-slate-50 p-4">
          <div class="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <CalendarDays class="size-4 text-teal-700" />
            发布设置
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="publishMode === 'published' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'"
              type="button"
              @click="publishMode = 'published'"
            >
              立即发布
            </button>
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="publishMode === 'draft' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'"
              type="button"
              @click="publishMode = 'draft'"
            >
              存草稿
            </button>
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="publishMode === 'scheduled' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'"
              type="button"
              @click="publishMode = 'scheduled'"
            >
              定时发布
            </button>
          </div>

          <div v-if="publishMode === 'scheduled'" class="mt-4">
            <label class="mb-2 block text-sm font-bold text-slate-700">发布时间</label>
            <input v-model="scheduledAt" class="input-field" type="datetime-local" />
          </div>
        </div>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
        <button class="btn-secondary sm:w-auto" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary sm:w-auto" type="button" @click="submit">
          <Save class="size-4" />
          {{ saveButtonLabel }}
        </button>
      </footer>
    </section>
  </div>
</template>
