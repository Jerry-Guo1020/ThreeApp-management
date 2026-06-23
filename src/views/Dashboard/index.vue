<script setup lang="ts">
import { ArrowUpRight, BadgeHelp, Bell, BottleWine, Clock3, Image, MessageSquareText, PackageCheck } from '@lucide/vue'
import { computed } from 'vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import { businessTypeLabels, dashboardMetrics } from '@/data/mockData'
import { getStoredProductsByType } from '@/stores/products'
import { questionState } from '@/stores/questions'
import { getVisibleStoredUpdates, updateState } from '@/stores/updates'

const wineProducts = computed(() => getStoredProductsByType('wine').slice(0, 3))
const specialtyProducts = computed(() => getStoredProductsByType('specialty').slice(0, 3))
const pendingQuestions = computed(() => questionState.value.filter((question) => question.status === 'pending'))
const latestUpdates = computed(() => getVisibleStoredUpdates())

const liveMetrics = computed(() =>
  dashboardMetrics.map((metric) => {
    if (metric.label === '待回复问答') {
      const pendingCount = pendingQuestions.value.length
      return {
        ...metric,
        value: String(pendingCount).padStart(2, '0'),
        hint: `当前待回复 ${pendingCount} 条`,
      }
    }

    if (metric.label === '商品更新') {
      const visibleCount = latestUpdates.value.length
      return {
        ...metric,
        value: String(updateState.value.length).padStart(2, '0'),
        hint: `当前展示 ${visibleCount} / 3 条`,
      }
    }

    return metric
  }),
)
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      <article v-for="metric in liveMetrics" :key="metric.label" class="card p-5">
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

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div class="space-y-6">
        <section class="card p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">商品运营概览</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">当前酒水和特产商品的上架情况与重点展示内容。</p>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-4">
              <div class="rounded-lg bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200">
                <p class="text-xl font-black text-slate-950">{{ wineProducts.length }}</p>
                <p class="mt-1 text-xs font-bold text-slate-500">酒水在售</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200">
                <p class="text-xl font-black text-slate-950">{{ specialtyProducts.length }}</p>
                <p class="mt-1 text-xs font-bold text-slate-500">特产在售</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200">
                <p class="text-xl font-black text-slate-950">{{ latestUpdates.length }}</p>
                <p class="mt-1 text-xs font-bold text-slate-500">消息轮播</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200">
                <p class="text-xl font-black text-slate-950">{{ pendingQuestions.length }}</p>
                <p class="mt-1 text-xs font-bold text-slate-500">待处理反馈</p>
              </div>
            </div>
          </div>

          <div class="mt-6 grid gap-4 xl:grid-cols-2">
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
        </section>

        <section class="card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-950">首页轮播通知</h2>
            <RouterLink class="text-sm font-extrabold text-teal-700" to="/updates">查看全部</RouterLink>
          </div>
          <div class="space-y-3">
            <article v-for="update in latestUpdates" :key="update.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-slate-900">{{ update.title }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ update.placement }} · {{ update.date }} · {{ update.author }}</p>
                </div>
                <StatusBadge :status="update.status" />
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="card p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-extrabold text-slate-950">待处理业务反馈</h2>
            <BadgeHelp class="size-5 text-teal-700" />
          </div>
          <div class="space-y-3">
            <RouterLink
              v-for="question in pendingQuestions"
              :key="question.id"
              class="group block rounded-lg bg-slate-50 p-4 transition hover:bg-teal-50"
              :to="`/questions/${question.id}`"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">
                      {{ businessTypeLabels[question.businessType] }}
                    </span>
                    <StatusBadge status="pending" label="待回复" />
                  </div>
                  <p class="mt-3 truncate text-sm font-extrabold text-slate-900">{{ question.subject }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{{ question.content }}</p>
                  <div class="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock3 class="size-3.5" />
                    {{ question.contactName }} · {{ question.createdAt }}
                  </div>
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
