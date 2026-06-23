<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, MessageSquareText } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { getCommentSummariesByType, productTypeLabels, type ProductType } from '@/data/mockData'

const props = defineProps<{
  type: ProductType
}>()

const summaries = computed(() => getCommentSummariesByType(props.type))
const totalComments = computed(() => summaries.value.reduce((sum, item) => sum + item.total, 0))
</script>

<template>
  <div class="space-y-6">
    <PageToolbar
      title="评论管理入口"
      description="先按商品查看评论概况，进入详情后管理全部评论与二级评论。"
      search-placeholder="搜索商品评论"
    >
      <template #actions>
        <RouterLink
          class="btn-secondary shrink-0"
          :class="props.type === 'wine' ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''"
          to="/comments/wine"
        >
          酒水
        </RouterLink>
        <RouterLink
          class="btn-secondary shrink-0"
          :class="props.type === 'specialty' ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''"
          to="/comments/specialty"
        >
          特产
        </RouterLink>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="card p-5">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-extrabold text-slate-950">{{ productTypeLabels[props.type] }}评论概况</h2>
            <p class="mt-1 text-sm text-slate-500">{{ totalComments }} 条评论 · 默认前台展示</p>
          </div>
          <MessageSquareText class="size-5 text-teal-700" />
        </div>

        <div class="space-y-3">
          <RouterLink
            v-for="summary in summaries"
            :key="summary.productId"
            class="group block rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:bg-teal-50 hover:ring-teal-100"
            :to="`/comments/${props.type}/${summary.productId}`"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="font-extrabold text-slate-950">{{ summary.productName }}</h3>
                <p class="mt-1 text-sm text-slate-500">
                  {{ summary.total }} 条评论 · {{ summary.secondLevel }} 条二级回复 · {{ summary.lastAt }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <StatusBadge v-if="summary.flagged" status="pending" :label="`${summary.flagged} 条标记`" />
                <span class="inline-flex items-center gap-1 text-sm font-extrabold text-teal-700">
                  进入评论
                  <ArrowUpRight class="size-4" />
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">规则说明</h2>
        <div class="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>评论默认直接前台展示，不走强审核流程。</p>
          <p>后台主要用于：删除不合适评论、回复用户、置顶优质评论、查看二级评论。</p>
          <p>如果后续需要敏感词或举报，再补充“标记异常”队列。</p>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-slate-50 p-4 text-center ring-1 ring-slate-200">
            <p class="text-2xl font-black text-slate-950">{{ summaries.length }}</p>
            <p class="mt-1 text-xs font-bold text-slate-500">商品入口</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-4 text-center ring-1 ring-slate-200">
            <p class="text-2xl font-black text-slate-950">{{ totalComments }}</p>
            <p class="mt-1 text-xs font-bold text-slate-500">总评论</p>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
