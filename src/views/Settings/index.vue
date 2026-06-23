<script setup lang="ts">
import { Building2, MapPin, Phone, Save, ShieldCheck } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="系统设置" description="维护平台基础资料、权限和发布偏好。" search-placeholder="搜索设置">
      <template #actions>
        <button class="btn-primary shrink-0" type="button">
          <Save class="size-4" />
          保存设置
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-3">
      <article class="card p-5 xl:col-span-2">
        <div class="mb-5 flex items-center gap-2">
          <Building2 class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">平台资料</h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <label>
            <span class="mb-2 block text-sm font-bold text-slate-700">平台名称</span>
            <input class="input-field" value="ThreeApp 商品内容管理平台" />
          </label>
          <label>
            <span class="mb-2 block text-sm font-bold text-slate-700">联系电话</span>
            <span class="relative block">
              <Phone class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input class="input-field pl-9" value="400-800-8888" />
            </span>
          </label>
          <label class="md:col-span-2">
            <span class="mb-2 block text-sm font-bold text-slate-700">服务地址</span>
            <span class="relative block">
              <MapPin class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input class="input-field pl-9" value="广东省清远市示范园区" />
            </span>
          </label>
        </div>
      </article>

      <article class="card p-5">
        <div class="mb-5 flex items-center gap-2">
          <ShieldCheck class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">发布偏好</h2>
        </div>
        <div class="space-y-3">
          <label class="flex items-center justify-between rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
            <span class="text-sm font-bold text-slate-700">评论默认展示</span>
            <input type="checkbox" checked />
          </label>
          <label class="flex items-center justify-between rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
            <span class="text-sm font-bold text-slate-700">更新需要确认</span>
            <input type="checkbox" checked />
          </label>
          <label class="flex items-center justify-between rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
            <span class="text-sm font-bold text-slate-700">素材自动分组</span>
            <input type="checkbox" checked />
          </label>
        </div>
      </article>
    </section>
  </div>
</template>
