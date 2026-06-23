<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eye, GripVertical, MessageSquareText, Pencil, Plus, RefreshCw } from '@lucide/vue'

import ActionIconButton from '@/components/common/ActionIconButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import MiniProgramPreview from '@/components/common/MiniProgramPreview.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import DetailImageManager from '@/components/product/DetailImageManager.vue'
import ProductFormDrawer from '@/components/product/ProductFormDrawer.vue'
import type { Product } from '@/data/mockData'
import { getStoredProductsByType, reorderStoredProducts } from '@/stores/products'

const drawerOpen = ref(false)
const activeProduct = ref<Product | null>(null)
const showSortGuide = ref(false)
const draggingId = ref<string | null>(null)
const products = computed(() => getStoredProductsByType('wine'))
const selectedProduct = computed(() => activeProduct.value ?? products.value[0] ?? null)

function openDrawer(product?: Product) {
  activeProduct.value = product ?? null
  drawerOpen.value = true
}

function handleDragStart(productId: string) {
  draggingId.value = productId
}

function handleDrop(targetId: string) {
  if (!draggingId.value) return
  const nextProducts = reorderStoredProducts('wine', draggingId.value, targetId)
  activeProduct.value = nextProducts.find((product) => product.id === targetId) ?? activeProduct.value
  draggingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar
      title="酒水商品"
      description="支持通过拖拽调整小程序销售榜、热门酒水等前台展示顺序。"
      :show-search="false"
      :show-filter="false"
    >
      <template #actions>
        <button class="btn-secondary shrink-0 sm:w-auto" type="button" @click="showSortGuide = !showSortGuide">
          <GripVertical class="size-4" />
          {{ showSortGuide ? '收起排序说明' : '查看排序说明' }}
        </button>
        <button class="btn-primary shrink-0 sm:w-auto" type="button" @click="openDrawer()">
          <Plus class="size-4" />
          新增酒水商品
        </button>
      </template>
    </PageToolbar>

    <section v-if="showSortGuide" class="card p-4 text-sm leading-7 text-slate-600">
      按住每一行左侧的拖拽手柄调整酒水列表顺序，排序结果可直接对应小程序销售榜、热销榜和酒水列表展示顺位。
    </section>

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.4fr)_380px]">
      <div class="space-y-6">
        <DataTable :columns="['排序', '商品', '风味 / 场景', '标签', '评论', '状态', '操作']">
          <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-slate-50"
            :class="draggingId === product.id ? 'opacity-60' : ''"
            @dragover.prevent
            @drop.prevent="handleDrop(product.id)"
          >
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <button
                  class="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm font-bold text-slate-600"
                  type="button"
                  draggable="true"
                  aria-label="拖拽排序"
                  @dragstart="handleDragStart(product.id)"
                  @dragend="draggingId = null"
                >
                  <GripVertical class="size-4" />
                  拖拽
                </button>
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
                  {{ String(product.sort).padStart(2, '0') }}
                </div>
              </div>
            </td>
            <td class="min-w-72 px-4 py-4">
              <div class="flex items-center gap-3">
                <div class="size-14 rounded-lg bg-gradient-to-br" :class="product.imageTone" />
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-slate-950">{{ product.name }}</p>
                  <p class="mt-1 truncate text-xs text-slate-500">{{ product.subtitle }}</p>
                </div>
              </div>
            </td>
            <td class="min-w-44 px-4 py-4 text-sm font-bold text-slate-700">
              <p>{{ product.category }}</p>
              <p class="mt-1 text-xs font-medium text-slate-500">{{ product.scene }}</p>
            </td>
            <td class="px-4 py-4">
              <span class="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-200">
                {{ product.tag }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm font-bold text-slate-700">{{ product.comments }} 条</td>
            <td class="px-4 py-4"><StatusBadge :status="product.status" /></td>
            <td class="px-4 py-4">
              <div class="flex gap-2">
                <ActionIconButton :icon="Pencil" label="编辑" title="编辑商品资料" @click="openDrawer(product)" />
                <ActionIconButton :icon="RefreshCw" label="通知" title="查看首页轮播通知内容" @click="activeProduct = product" />
                <RouterLink :to="`/comments/wine/${product.id}`">
                  <ActionIconButton :icon="MessageSquareText" label="评论" title="进入评论管理" />
                </RouterLink>
                <ActionIconButton :icon="Eye" label="预览" title="预览小程序效果" @click="activeProduct = product" />
              </div>
            </td>
          </tr>
        </DataTable>

        <DetailImageManager v-if="selectedProduct" :product="selectedProduct" />
      </div>

      <MiniProgramPreview v-if="selectedProduct" :product="selectedProduct" />
    </section>

    <ProductFormDrawer :open="drawerOpen" type="wine" :product="activeProduct" @close="drawerOpen = false" />
  </div>
</template>
