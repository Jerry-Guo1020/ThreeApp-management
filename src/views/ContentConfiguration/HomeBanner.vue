<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Save, Upload } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { homeBanners } from '@/data/mockData'

const editOpen = ref(false)
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="首页 Banner 配置" description="3 张图 · 支持排序、上下架、跳转商品或页面。" search-placeholder="搜索 Banner">
      <template #actions>
        <button class="btn-primary shrink-0" type="button" @click="editOpen = true">
          <Plus class="size-4" />
          新增 Banner
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div class="card p-5">
        <div class="space-y-3">
          <article v-for="banner in homeBanners" :key="banner.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-4 md:flex-row md:items-center">
              <div class="h-24 w-full rounded-lg bg-gradient-to-br from-teal-100 to-sky-200 md:w-44" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-black text-slate-400">{{ String(banner.sort).padStart(2, '0') }}</span>
                  <h2 class="font-extrabold text-slate-950">{{ banner.title }}</h2>
                  <StatusBadge :status="banner.status" />
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-500">{{ banner.description }}</p>
                <p class="mt-2 text-sm font-bold text-slate-700">跳转：{{ banner.target }}</p>
              </div>
              <button class="btn-secondary shrink-0" type="button" @click="editOpen = true">编辑</button>
            </div>
          </article>
        </div>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">内容配置编辑弹窗</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">同一个 Modal/Drawer 结构承载 Banner、排序、上下架和跳转绑定。</p>
        <div class="mt-5 space-y-4 rounded-lg bg-slate-50 p-4">
          <input class="input-field" value="岭南风味 · 地道特产" />
          <select class="input-field">
            <option>商品 / 分类 / 页面</option>
          </select>
          <div class="grid grid-cols-2 gap-3">
            <input class="input-field" value="03" />
            <button class="rounded-lg bg-teal-50 px-3 py-2 text-sm font-extrabold text-teal-700 ring-1 ring-teal-200" type="button">上架</button>
          </div>
          <UploadGrid compact title="上传 Banner 图片" hint="建议 1500 x 640" />
        </div>
      </aside>
    </section>

    <div v-if="editOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="editOpen = false">
      <section class="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
        <header class="border-b border-slate-200 px-5 py-4">
          <h2 class="text-lg font-extrabold text-slate-950">编辑 Banner</h2>
          <p class="mt-1 text-sm text-slate-500">配置图片、跳转目标、排序和上下架状态。</p>
        </header>
        <div class="space-y-4 p-5">
          <div class="grid gap-4 md:grid-cols-3">
            <input class="input-field md:col-span-2" value="岭南风味 · 地道特产" />
            <input class="input-field" value="03" />
          </div>
          <UploadGrid title="上传 Banner 图片" hint="支持拖拽上传和素材库选择" />
        </div>
        <footer class="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button class="btn-secondary" type="button" @click="editOpen = false">取消</button>
          <button class="btn-primary" type="button" @click="editOpen = false">
            <Save class="size-4" />
            保存配置
          </button>
          <button class="btn-secondary" type="button">
            <Upload class="size-4" />
            选素材
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>
