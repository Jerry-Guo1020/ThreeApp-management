<script setup lang="ts">
import { Save, Snowflake } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { contentConfigs } from '@/data/mockData'

const config = contentConfigs.coldStorage
const descriptions = ['项目概况、面积、温度、吞吐量', '需求咨询、方案设计、施工安装', '生鲜、冷冻、医药、餐饮连锁', '微信咨询、电话咨询、表单留资']
</script>

<template>
  <div class="space-y-6">
    <PageToolbar :title="config.title" :description="config.description" search-placeholder="搜索冷库项目内容">
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
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-950">{{ item }}</h2>
            <Snowflake class="size-5 text-sky-600" />
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ descriptions[index] }}</p>
          <div class="mt-5 h-32 rounded-lg bg-gradient-to-br from-sky-50 to-cyan-100 ring-1 ring-sky-100" />
          <button class="btn-secondary mt-5 w-full" type="button">编辑模块</button>
        </article>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">配置示例</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">适合维护工程项目介绍、服务流程、场景和咨询入口。</p>
        <div class="mt-5 space-y-4 rounded-lg bg-slate-50 p-4">
          <input class="input-field" value="冷库工程服务" />
          <textarea class="input-field min-h-24 resize-none" value="从需求咨询到施工安装的一站式冷链工程服务。" />
          <UploadGrid compact title="上传冷库项目图" hint="项目介绍或流程步骤配图" />
          <button class="btn-primary w-full" type="button">保存冷库配置</button>
        </div>
      </aside>
    </section>
  </div>
</template>
