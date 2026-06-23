<script setup lang="ts">
import { Save } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { contentConfigs } from '@/data/mockData'

const config = contentConfigs.specialty
const descriptions = ['标题、描述、口号、展示状态', '手工制作、原产地、安全品质', '清远、潮汕、顺德及代表商品', '禽肉蛋品、山珍蔬食、茶叶冲饮']
</script>

<template>
  <div class="space-y-6">
    <PageToolbar :title="config.title" :description="config.description" search-placeholder="搜索特产配置">
      <template #actions>
        <button class="btn-primary shrink-0 sm:w-auto" type="button">
          <Save class="size-4" />
          {{ config.buttonLabel }}
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div class="grid gap-4 md:grid-cols-2">
        <article v-for="(item, index) in config.items" :key="item" class="card p-5">
          <h2 class="text-lg font-extrabold text-slate-950">{{ item }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ descriptions[index] }}</p>
          <div class="mt-5 h-32 rounded-lg bg-gradient-to-br from-emerald-50 to-lime-100 ring-1 ring-emerald-100" />
          <button class="btn-secondary mt-5 w-full" type="button">编辑模块</button>
        </article>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">配置示例</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">可维护模块标题、描述、展示状态、关联商品和图片素材。</p>
        <div class="mt-5 space-y-4 rounded-lg bg-slate-50 p-4">
          <input class="input-field" value="岭南风味 · 地道特产" />
          <textarea class="input-field min-h-24 resize-none" value="展示广东各地区原产地特色商品。" />
          <UploadGrid compact title="上传模块图片" hint="适用于品牌故事或分类入口" />
          <button class="btn-primary w-full" type="button">保存特产配置</button>
        </div>
      </aside>
    </section>
  </div>
</template>
