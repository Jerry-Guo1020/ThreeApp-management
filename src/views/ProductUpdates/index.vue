<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, Bell, Pencil, Plus, Trash2 } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ProductUpdateModal from '@/components/product/ProductUpdateModal.vue'
import { productTypeLabels, type ProductUpdate, type ProductType } from '@/data/mockData'
import { deleteStoredUpdate, getStoredUpdatesByType, getVisibleStoredUpdatesByType, moveStoredUpdate, saveStoredUpdate } from '@/stores/updates'

const activeType = ref<ProductType>('wine')
const modalOpen = ref(false)
const activeUpdateId = ref<string | null>(null)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

const filteredUpdates = computed(() => getStoredUpdatesByType(activeType.value))
const visibleUpdates = computed(() => getVisibleStoredUpdatesByType(activeType.value))
const visibleIdSet = computed(() => new Set(visibleUpdates.value.map((item) => item.id)))
const activeUpdate = computed<ProductUpdate | null>(() => filteredUpdates.value.find((item) => item.id === activeUpdateId.value) ?? null)

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function openCreateModal() {
  activeUpdateId.value = null
  modalOpen.value = true
}

function openEditModal(updateId: string) {
  activeUpdateId.value = updateId
  modalOpen.value = true
}

function closeModal() {
  activeUpdateId.value = null
  modalOpen.value = false
}

function handleSave(payload: Parameters<typeof saveStoredUpdate>[0]) {
  const result = saveStoredUpdate(payload)
  openToast(result.ok ? 'success' : 'error', result.ok ? '保存成功' : '保存失败', result.message)
  if (result.ok) {
    closeModal()
  }
}

function handleDelete(updateId: string) {
  const result = deleteStoredUpdate(updateId)
  openToast(result.ok ? 'success' : 'error', result.ok ? '删除成功' : '删除失败', result.message)
}

function move(updateId: string, direction: 'up' | 'down') {
  moveStoredUpdate(activeType.value, updateId, direction)
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="商品更新" description="维护首页文字轮播通知，已发布内容按顺序最多展示 3 条。" :show-search="false" :show-filter="false">
      <template #actions>
        <button class="btn-primary shrink-0 sm:w-auto" type="button" @click="openCreateModal">
          <Plus class="size-4" />
          新增通知
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="card p-5">
        <div class="mb-5 flex flex-wrap gap-2">
          <button
            v-for="type in (['wine', 'specialty'] as ProductType[])"
            :key="type"
            class="rounded-lg px-4 py-2 text-sm font-extrabold ring-1 ring-inset transition"
            :class="activeType === type ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'"
            type="button"
            @click="activeType = type"
          >
            {{ productTypeLabels[type] }}
          </button>
        </div>

        <div class="space-y-3">
          <article v-for="(update, index) in filteredUpdates" :key="update.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">
                      顺序 {{ String(update.sort).padStart(2, '0') }}
                    </span>
                    <StatusBadge :status="update.status" />
                    <span
                      v-if="update.status === 'published'"
                      class="rounded-full px-2.5 py-1 text-xs font-extrabold ring-1"
                      :class="visibleIdSet.has(update.id) ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-amber-50 text-amber-700 ring-amber-200'"
                    >
                      {{ visibleIdSet.has(update.id) ? '前台展示中' : '超出展示上限' }}
                    </span>
                  </div>
                  <h2 class="mt-3 text-base font-extrabold text-slate-950">{{ update.title }}</h2>
                  <p class="mt-2 text-sm leading-6 text-slate-600">{{ update.description }}</p>
                  <p class="mt-2 text-xs text-slate-500">{{ update.placement }} · {{ update.date }} · {{ update.author }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" :disabled="index === 0" @click="move(update.id, 'up')">
                  <ArrowUp class="size-4" />
                  上移
                </button>
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" :disabled="index === filteredUpdates.length - 1" @click="move(update.id, 'down')">
                  <ArrowDown class="size-4" />
                  下移
                </button>
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs sm:w-auto" type="button" @click="openEditModal(update.id)">
                  <Pencil class="size-4" />
                  编辑
                </button>
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs text-rose-700 sm:w-auto" type="button" @click="handleDelete(update.id)">
                  <Trash2 class="size-4" />
                  删除
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="card p-5">
        <div class="flex items-center gap-2">
          <Bell class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">当前前台展示</h2>
        </div>
        <p class="mt-1 text-sm leading-6 text-slate-500">{{ productTypeLabels[activeType] }}已发布通知会按顺序取前 3 条进入首页文字轮播。</p>
        <div class="mt-5 space-y-3">
          <article v-for="update in visibleUpdates" :key="update.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-xs font-extrabold text-slate-400">第 {{ update.sort }} 条</p>
            <h3 class="mt-2 text-sm font-extrabold text-slate-950">{{ update.title }}</h3>
            <p class="mt-2 text-xs leading-5 text-slate-500">{{ update.description }}</p>
          </article>
          <div v-if="visibleUpdates.length === 0" class="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-200">
            当前还没有已发布通知。
          </div>
        </div>
      </aside>
    </section>

    <ProductUpdateModal :open="modalOpen" :type="activeType" :update="activeUpdate" @close="closeModal" @save="handleSave" />
    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
