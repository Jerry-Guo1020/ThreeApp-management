<script setup lang="ts">
import { computed } from 'vue'
import { ImagePlus, Save, X } from '@lucide/vue'

import UploadGrid from '@/components/common/UploadGrid.vue'
import type { Product, ProductType } from '@/data/mockData'
import { productTypeLabels } from '@/data/mockData'

const props = withDefaults(
  defineProps<{
    open: boolean
    type: ProductType
    product?: Product | null
  }>(),
  {
    product: null,
  },
)

const emit = defineEmits<{
  close: []
}>()

const isWine = computed(() => props.type === 'wine')
const title = computed(() => `${props.product ? '编辑' : '新增'}${productTypeLabels[props.type]}商品`)
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 flex justify-end bg-slate-950/35" @click.self="emit('close')">
    <aside class="flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">{{ title }}</h2>
          <p class="text-xs text-slate-500">维护商品基础资料、展示信息和图片内容。</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="flex-1 space-y-6 overflow-y-auto p-5">
        <section class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '酒水名称' : '商品标题' }}</label>
            <input class="input-field" :value="props.product?.name ?? (isWine ? '波本蓝君邑 XO' : '清远走地鸡 散养土鸡')" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '风味类型' : '分类' }}</label>
              <input class="input-field" :value="props.product?.category ?? (isWine ? '威士忌' : '清远特产')" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '使用场景' : '地区' }}</label>
              <input class="input-field" :value="props.product?.scene ?? (isWine ? '商务馈赠' : '广东清远')" />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">{{ isWine ? '详情卖点' : '品牌 / 标签' }}</label>
            <textarea
              class="input-field min-h-24 resize-none"
              :value="props.product?.description ?? (isWine ? '高端威士忌，醇厚绵柔，适合商务礼赠。' : '清远农家，热销，散养，新鲜配送。')"
            />
          </div>
        </section>

        <section class="space-y-3">
          <h3 class="text-sm font-extrabold text-slate-950">展示配置</h3>
          <div class="flex flex-wrap gap-2">
            <button class="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-700 ring-1 ring-teal-200" type="button">
              {{ isWine ? '热门酒水' : '热销特产' }}
            </button>
            <button class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200" type="button">
              详情推荐
            </button>
            <button class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200" type="button">
              联系入口
            </button>
          </div>
        </section>

        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-slate-950">封面图与详情图</h3>
            <ImagePlus class="size-4 text-teal-700" />
          </div>
          <UploadGrid compact title="上传商品图片" hint="封面、详情图和小程序预览图片" />
        </section>
      </div>

      <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
        <button class="btn-secondary sm:w-auto" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary sm:w-auto" type="button" @click="emit('close')">
          <Save class="size-4" />
          保存
        </button>
      </footer>
    </aside>
  </div>
</template>
