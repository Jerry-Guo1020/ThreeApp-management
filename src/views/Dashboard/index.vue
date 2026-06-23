<script setup lang="ts">
import { ArrowUpRight, BadgeHelp, Bell, BottleWine, Image, MessageSquareText, PackageCheck, Plus } from '@lucide/vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import { dashboardMetrics, getProductsByType, questions, updates } from '@/data/mockData'

const wineProducts = getProductsByType('wine')
const specialtyProducts = getProductsByType('specialty')

const componentNotes = ['layout: flex h-screen', 'sidebar: w-64 border-r', 'card: rounded-lg border', 'table: divide-y']
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="metric in dashboardMetrics" :key="metric.label" class="card p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-bold text-slate-500">{{ metric.label }}</p>
            <p class="mt-4 text-4xl font-black text-slate-950">{{ metric.value }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ metric.hint }}</p>
          </div>
          <div class="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <MessageSquareText v-if="metric.label === '今日评论'" class="size-5" />
            <BadgeHelp v-else-if="metric.label === '待回复问答'" class="size-5" />
            <Bell v-else-if="metric.label === '商品更新'" class="size-5" />
            <Image v-else class="size-5" />
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
      <div class="card p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-extrabold text-slate-950">Tailwind 组件约定</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">后台页面统一使用白底、细边框、圆角和可复用工具栏结构。</p>
          </div>
          <RouterLink class="btn-primary" to="/products/wine">
            <Plus class="size-4" />
            新增内容
          </RouterLink>
        </div>
        <div class="mt-5 flex flex-wrap gap-3">
          <span v-for="note in componentNotes" :key="note" class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-600">
            {{ note }}
          </span>
        </div>
        <p class="mt-6 text-sm leading-7 text-slate-600">
          后续前端实现直接按 Tailwind CSS class 写：bg-slate-50、bg-white、text-slate-900、border-slate-200、rounded-lg、shadow-sm。
        </p>

        <div class="mt-6 grid gap-4 lg:grid-cols-2">
          <article class="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div class="mb-4 flex items-center gap-2">
              <BottleWine class="size-5 text-teal-700" />
              <h3 class="font-extrabold text-slate-950">酒水商品</h3>
            </div>
            <div class="space-y-3">
              <div v-for="product in wineProducts" :key="product.id" class="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <div class="size-12 rounded-lg bg-gradient-to-br" :class="product.imageTone" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-extrabold text-slate-900">{{ product.name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ product.subtitle }}</p>
                </div>
                <StatusBadge :status="product.status" />
              </div>
            </div>
          </article>

          <article class="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div class="mb-4 flex items-center gap-2">
              <PackageCheck class="size-5 text-teal-700" />
              <h3 class="font-extrabold text-slate-950">特产商品</h3>
            </div>
            <div class="space-y-3">
              <div v-for="product in specialtyProducts" :key="product.id" class="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <div class="size-12 rounded-lg bg-gradient-to-br" :class="product.imageTone" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-extrabold text-slate-900">{{ product.name }}</p>
                  <p class="truncate text-xs text-slate-500">{{ product.subtitle }}</p>
                </div>
                <StatusBadge :status="product.status" />
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="space-y-6">
        <section class="card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-950">近期商品更新</h2>
            <RouterLink class="text-sm font-extrabold text-teal-700" to="/updates">查看</RouterLink>
          </div>
          <div class="space-y-3">
            <article v-for="update in updates.slice(0, 3)" :key="update.id" class="rounded-lg bg-slate-50 p-3">
              <p class="text-sm font-extrabold text-slate-900">{{ update.title }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ update.placement }} · {{ update.date }}</p>
            </article>
          </div>
        </section>

        <section class="card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-950">待处理问答</h2>
            <BadgeHelp class="size-5 text-teal-700" />
          </div>
          <div class="space-y-3">
            <RouterLink
              v-for="question in questions"
              :key="question.id"
              class="group block rounded-lg bg-slate-50 p-3 transition hover:bg-teal-50"
              :to="`/questions/${question.id}`"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-slate-900">{{ question.productName }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{{ question.question }}</p>
                </div>
                <ArrowUpRight class="size-4 shrink-0 text-slate-400 group-hover:text-teal-700" />
              </div>
            </RouterLink>
          </div>
        </section>
      </aside>
    </section>
  </div>
</template>
