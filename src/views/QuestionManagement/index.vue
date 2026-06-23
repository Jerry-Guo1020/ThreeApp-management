<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, MessageSquareReply, Phone, Shapes } from '@lucide/vue'

import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { businessTypeLabels } from '@/data/mockData'
import { questionState } from '@/stores/questions'

const activeFilter = ref<'all' | 'pending' | 'replied'>('all')

const filteredQuestions = computed(() => {
  if (activeFilter.value === 'all') return questionState.value
  return questionState.value.filter((question) => question.status === activeFilter.value)
})
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="问答管理" description="集中处理用户在小程序内提交的业务咨询与问题反馈。" :show-search="false" :show-filter="false">
      <template #actions>
        <button class="btn-secondary shrink-0" type="button" :class="activeFilter === 'all' ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''" @click="activeFilter = 'all'">全部</button>
        <button class="btn-secondary shrink-0" type="button" :class="activeFilter === 'pending' ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''" @click="activeFilter = 'pending'">未回复</button>
        <button class="btn-secondary shrink-0" type="button" :class="activeFilter === 'replied' ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''" @click="activeFilter = 'replied'">已回复</button>
      </template>
    </PageToolbar>

    <section class="card p-5">
      <div class="space-y-3">
        <RouterLink
          v-for="question in filteredQuestions"
          :key="question.id"
          class="group block rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:bg-teal-50 hover:ring-teal-100"
          :to="`/questions/${question.id}`"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-500 ring-1 ring-slate-200">
                  {{ businessTypeLabels[question.businessType] }}
                </span>
                <StatusBadge :status="question.status" />
              </div>
              <h2 class="mt-3 text-base font-extrabold text-slate-950">{{ question.subject }}</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ question.content }}</p>
              <div class="mt-3 flex flex-col gap-2 text-xs font-bold text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <span class="inline-flex items-center gap-1.5">
                  <Shapes class="size-3.5" />
                  {{ question.contactName }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <Phone class="size-3.5" />
                  {{ question.contactPhone }}
                </span>
                <span>{{ question.createdAt }}</span>
              </div>
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
