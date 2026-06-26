<template>
  <div class="space-y-6">
    <PageToolbar title="素材管理" description="商品封面、Banner、详情图、评价图、地区图片分组管理，后续直接绑定到内容或商品。" search-placeholder="搜索素材">
      <template #actions>
        <button class="btn-primary shrink-0 sm:w-auto" type="button" @click="uploadOpen = true">
          <Plus class="size-4" />
          上传素材
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside class="card p-4">
        <h2 class="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-400">素材分组</h2>
        <div class="space-y-2">
          <button
            v-for="group in groups"
            :key="group"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-teal-700"
            type="button"
          >
            <FolderOpen class="size-4" />
            {{ group }}
          </button>
        </div>
      </aside>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article v-for="asset in materials" :key="asset.id" class="card overflow-hidden">
          <div class="h-36 bg-gradient-to-br" :class="asset.tone" />
          <div class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="truncate font-extrabold text-slate-950">{{ asset.name }}</h2>
                <p class="mt-1 text-sm text-slate-500">{{ asset.size }}</p>
              </div>
              <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-extrabold text-slate-500">{{ asset.group }}</span>
            </div>
            <p class="mt-4 text-sm text-slate-500">绑定：{{ asset.usedBy }}</p>
          </div>
        </article>
      </div>
    </section>

    <div v-if="uploadOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="uploadOpen = false">
      <section class="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <header class="border-b border-slate-200 px-5 py-4">
          <h2 class="text-lg font-extrabold text-slate-950">上传素材</h2>
          <p class="mt-1 text-sm text-slate-500">拖拽上传并选择素材分组。</p>
        </header>
        <div class="space-y-4 p-5">
          <UploadGrid title="拖拽上传素材" hint="支持商品封面、Banner、详情图和评价图" />
          <select class="input-field">
            <option v-for="group in groups" :key="group">{{ group }}</option>
          </select>
        </div>
        <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
          <button class="btn-secondary sm:w-auto" type="button" @click="uploadOpen = false">取消</button>
          <button class="btn-primary sm:w-auto" type="button" @click="uploadOpen = false">
            <Upload class="size-4" />
            确认上传
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FolderOpen, Plus, Upload } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { materials } from '@/data/mockData'

const uploadOpen = ref(false)
const groups = ['商品封面', 'Banner', '详情图片', '评价图片', '地区图片']
</script>

