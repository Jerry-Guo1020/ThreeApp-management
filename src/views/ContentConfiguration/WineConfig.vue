<script setup lang="ts">
import { Save } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { contentConfigs } from '@/data/mockData'

const config = contentConfigs.wine
const descriptions = ['榜单排序、主推标签、跳转详情', '婚宴、聚会、商务、独饮', '口感、包装、物流、性价比', '订购咨询、配送安排、搭配建议']
</script>

<template>
  <div class="space-y-6">
    <PageToolbar :title="config.title" :description="config.description" search-placeholder="搜索酒水配置">
      <template #actions>
        <button class="btn-primary shrink-0" type="button">
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
          <div class="mt-5 h-32 rounded-lg bg-gradient-to-br from-amber-50 to-sky-100 ring-1 ring-amber-100" />
          <button class="btn-secondary mt-5 w-full" type="button">编辑模块</button>
        </article>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">酒水配置弹窗</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">用于维护热门酒水、场景推荐、详情卖点和联系入口。</p>
        <div class="mt-5 space-y-4 rounded-lg bg-slate-50 p-4">
          <input class="input-field" value="节日礼赠 · 精选酒水" />
          <textarea class="input-field min-h-24 resize-none" value="根据场景展示酒水产品和联系入口。" />
          <UploadGrid compact title="上传酒水模块图片" hint="热销榜或场景入口图片" />
          <button class="btn-primary w-full" type="button">保存酒水配置</button>
        </div>
      </aside>
    </section>
  </div>
</template>
