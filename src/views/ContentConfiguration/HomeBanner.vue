<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, Pencil } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import BannerEditModal from '@/components/content/BannerEditModal.vue'
import type { ContentCard } from '@/data/mockData'
import { getStoredBanners, moveStoredBanner, saveStoredBanner } from '@/stores/banners'

const editOpen = ref(false)
const activeBannerId = ref<string | null>(null)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

const banners = computed(() => getStoredBanners())
const activeBanner = computed<ContentCard | null>(() => banners.value.find((item) => item.id === activeBannerId.value) ?? null)

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function openEditor(bannerId: string) {
  activeBannerId.value = bannerId
  editOpen.value = true
}

function closeEditor() {
  activeBannerId.value = null
  editOpen.value = false
}

function move(bannerId: string, direction: 'up' | 'down') {
  moveStoredBanner(bannerId, direction)
}

function handleSave(payload: Parameters<typeof saveStoredBanner>[0]) {
  const result = saveStoredBanner(payload)
  openToast(result.ok ? 'success' : 'error', result.ok ? '保存成功' : '保存失败', result.message)
  if (result.ok) {
    closeEditor()
  }
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="首页 Banner 配置" description="固定 3 张轮播图，按顺序控制封面、标题和小标题展示。" :show-search="false" :show-filter="false" />

    <section class="card p-5">
      <p class="mb-5 text-sm leading-6 text-slate-500">首页会按当前顺序轮播这 3 张图片，直接在这里调整顺序和内容即可。</p>

      <div class="space-y-3">
        <article v-for="(banner, index) in banners" :key="banner.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
          <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="h-24 w-full rounded-lg bg-gradient-to-br from-teal-100 to-sky-200 md:w-44" />

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">
                  第 {{ banner.sort }} 张
                </span>
                <StatusBadge :status="banner.status" />
              </div>
              <h2 class="mt-3 text-base font-extrabold text-slate-950">{{ banner.title }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500">{{ banner.description }}</p>
              <p class="mt-2 text-xs text-slate-400">封面：{{ banner.imageName }}</p>
              <p class="mt-1 text-xs text-slate-400">对应页面：{{ banner.target }}</p>
            </div>

            <div class="flex flex-wrap gap-2 md:w-auto">
              <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" :disabled="index === 0" @click="move(banner.id, 'up')">
                <ArrowUp class="size-4" />
                上移
              </button>
              <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" :disabled="index === banners.length - 1" @click="move(banner.id, 'down')">
                <ArrowDown class="size-4" />
                下移
              </button>
              <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" @click="openEditor(banner.id)">
                <Pencil class="size-4" />
                编辑
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <BannerEditModal :open="editOpen" :banner="activeBanner" @close="closeEditor" @save="handleSave" />
    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
