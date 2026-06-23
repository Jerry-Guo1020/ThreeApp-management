<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, Eye, MessageSquareText, Pencil, Plus, RefreshCw } from '@lucide/vue'

import DataTable from '@/components/common/DataTable.vue'
import MiniProgramPreview from '@/components/common/MiniProgramPreview.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import DetailImageManager from '@/components/product/DetailImageManager.vue'
import ProductFormDrawer from '@/components/product/ProductFormDrawer.vue'
import { getProductsByType, type Product } from '@/data/mockData'

const drawerOpen = ref(false)
const activeProduct = ref<Product | null>(null)
const products = getProductsByType('wine')
const selectedProduct = computed(() => activeProduct.value ?? products[0])

function openDrawer(product?: Product) {
  activeProduct.value = product ?? null
  drawerOpen.value = true
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="酒水商品" description="酒水商品和特产商品分开管理，字段、分类、场景与详情图独立维护。" search-placeholder="搜索酒水商品">
      <template #actions>
        <button class="btn-secondary shrink-0" type="button">
          <Download class="size-4" />
          导入数据
        </button>
        <button class="btn-primary shrink-0" type="button" @click="openDrawer()">
          <Plus class="size-4" />
          新增酒水商品
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.4fr)_380px]">
      <div class="space-y-6">
        <DataTable :columns="['商品', '风味 / 场景', '标签', '评论', '状态', '操作']">
          <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50">
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
                <button class="icon-button h-9 w-9" type="button" aria-label="编辑" @click="openDrawer(product)">
                  <Pencil class="size-4" />
                </button>
                <button class="icon-button h-9 w-9" type="button" aria-label="更新" @click="activeProduct = product">
                  <RefreshCw class="size-4" />
                </button>
                <RouterLink class="icon-button h-9 w-9" :to="`/comments/wine/${product.id}`" aria-label="评论">
                  <MessageSquareText class="size-4" />
                </RouterLink>
                <button class="icon-button h-9 w-9" type="button" aria-label="预览" @click="activeProduct = product">
                  <Eye class="size-4" />
                </button>
              </div>
            </td>
          </tr>
        </DataTable>

        <DetailImageManager :product="selectedProduct" />
      </div>

      <MiniProgramPreview :product="selectedProduct" />
    </section>

    <ProductFormDrawer :open="drawerOpen" type="wine" :product="activeProduct" @close="drawerOpen = false" />
  </div>
</template>
