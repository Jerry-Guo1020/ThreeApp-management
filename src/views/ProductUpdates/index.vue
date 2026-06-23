<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ProductUpdateModal from '@/components/product/ProductUpdateModal.vue'
import { productTypeLabels, statusLabels, updates, type ProductType } from '@/data/mockData'

const activeType = ref<ProductType>('wine')
const modalOpen = ref(false)
const filteredUpdates = computed(() => updates.filter((update) => update.type === activeType.value))
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="商品更新管理" description="管理商品详情、热销榜、场景页上的图片和文案更新。" search-placeholder="搜索更新内容">
      <template #actions>
        <button class="btn-primary shrink-0" type="button" @click="modalOpen = true">
          <Plus class="size-4" />
          新增更新
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
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
          <article v-for="update in filteredUpdates" :key="update.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <h2 class="truncate text-base font-extrabold text-slate-950">{{ update.title }}</h2>
                <p class="mt-1 text-sm text-slate-500">{{ update.placement }} · {{ update.date }} · {{ update.author }}</p>
              </div>
              <StatusBadge :status="update.status" />
            </div>
          </article>
        </div>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">新增更新弹窗</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">弹窗包含商品选择、更新类型、说明、发布状态，复用在酒水和特产。</p>
        <div class="mt-5 space-y-4 rounded-lg bg-slate-50 p-4">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">选择商品</label>
            <div class="rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              {{ activeType === 'wine' ? '西凤酒' : '清远走地鸡' }}
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">更新类型</label>
            <div class="rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">图片 / 文案</div>
          </div>
          <div class="rounded-lg bg-white p-3 text-sm leading-6 text-slate-500 ring-1 ring-slate-200">
            当前 {{ productTypeLabels[activeType] }}共有 {{ filteredUpdates.length }} 条更新，其中 {{ filteredUpdates.filter((item) => item.status === 'published').length }} 条已发布。
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">立即发布</div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">存草稿</div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">定时发布</div>
          </div>
        </div>
        <div class="mt-5 rounded-lg bg-teal-50 p-4 text-sm leading-6 text-teal-800">
          状态使用统一组件展示：{{ Object.values(statusLabels).join('、') }}。
        </div>
      </aside>
    </section>

    <ProductUpdateModal :open="modalOpen" :type="activeType" @close="modalOpen = false" />
  </div>
</template>
