<template>
  <div v-if="props.open && props.banner" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('close')">
    <section class="w-full max-w-xl rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">编辑轮播图</h2>
          <p class="text-xs text-slate-500">修改封面图、标题和小标题内容，轮播顺序请在列表中直接调整。</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-5 p-5">
        <div class="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200">
          当前对应页面：{{ props.banner.target }}
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">封面图片</label>
          <UploadGrid compact :multiple="false" :current-label="imageName" title="上传轮播封面" hint="建议使用 1500 x 640 的本地图片" @selected="handleSelected" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">标题</label>
          <input v-model="title" class="input-field" placeholder="请输入轮播图标题" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">小标题</label>
          <textarea v-model="description" class="input-field min-h-24 resize-none" placeholder="请输入轮播图小标题" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">展示状态</label>
          <div class="grid gap-3 sm:grid-cols-3">
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="status === 'published' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'"
              type="button"
              @click="status = 'published'"
            >
              展示中
            </button>
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="status === 'draft' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'"
              type="button"
              @click="status = 'draft'"
            >
              草稿
            </button>
            <button
              class="rounded-lg px-3 py-2 text-sm font-bold ring-1 ring-inset transition"
              :class="status === 'hidden' ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'"
              type="button"
              @click="status = 'hidden'"
            >
              隐藏
            </button>
          </div>
        </div>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
        <button class="btn-secondary sm:w-auto" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary sm:w-auto" type="button" @click="submit">
          <Save class="size-4" />
          保存修改
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Save, X } from '@lucide/vue'

import UploadGrid from '@/components/common/UploadGrid.vue'
import type { ContentCard } from '@/data/mockData'
import type { SaveBannerPayload } from '@/stores/banners'

const props = defineProps<{
  open: boolean
  banner?: ContentCard | null
}>()

const emit = defineEmits<{
  close: []
  save: [payload: SaveBannerPayload]
}>()

const title = ref('')
const description = ref('')
const status = ref<'published' | 'draft' | 'hidden'>('published')
const imageName = ref('')

watch(
  () => props.banner,
  (banner) => {
    title.value = banner?.title ?? ''
    description.value = banner?.description ?? ''
    status.value = (banner?.status === 'scheduled' ? 'draft' : banner?.status ?? 'published') as 'published' | 'draft' | 'hidden'
    imageName.value = banner?.imageName ?? ''
  },
  { immediate: true },
)

function handleSelected(fileNames: string[]) {
  imageName.value = fileNames[0] ?? imageName.value
}

function submit() {
  if (!props.banner) return

  emit('save', {
    id: props.banner.id,
    title: title.value,
    description: description.value,
    status: status.value,
    imageName: imageName.value,
  })
}
</script>
