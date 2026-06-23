<script setup lang="ts">
import { ArrowUpRight, MessageSquareReply } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { productTypeLabels, questions } from '@/data/mockData'
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="问答管理" description="集中处理用户咨询、商品问题和待回复内容。" search-placeholder="搜索问答">
      <template #actions>
        <button class="btn-secondary shrink-0" type="button">酒水 7</button>
        <button class="btn-secondary shrink-0" type="button">特产 5</button>
      </template>
    </PageToolbar>

    <section class="card p-5">
      <div class="space-y-3">
        <RouterLink
          v-for="question in questions"
          :key="question.id"
          class="group block rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:bg-teal-50 hover:ring-teal-100"
          :to="`/questions/${question.id}`"
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-extrabold text-slate-950">{{ question.productName }}</h2>
                <span class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">
                  {{ productTypeLabels[question.type] }}
                </span>
                <StatusBadge :status="question.status" />
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ question.question }}</p>
              <p class="mt-2 text-xs font-bold text-slate-400">{{ question.user }} · {{ question.createdAt }}</p>
            </div>
            <span class="inline-flex items-center gap-1 text-sm font-extrabold text-teal-700">
              <MessageSquareReply class="size-4" />
              处理
              <ArrowUpRight class="size-4" />
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
