<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowLeft, Send } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { productTypeLabels } from '@/data/mockData'
import { getStoredQuestionById, replyToStoredQuestion } from '@/stores/questions'

const props = defineProps<{
  id: string
}>()

const reply = ref('')
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

const question = computed(() => getStoredQuestionById(props.id))

watch(
  question,
  (value) => {
    reply.value = value?.reply ?? ''
  },
  { immediate: true },
)

function submitReply() {
  if (!reply.value.trim()) {
    toastTone.value = 'error'
    toastTitle.value = '回复失败'
    toastMessage.value = '请先填写回复内容。'
    toastOpen.value = true
    return
  }

  if (question.value) {
    replyToStoredQuestion(question.value.id, reply.value.trim())
  }

  toastTone.value = 'success'
  toastTitle.value = '回复成功'
  toastMessage.value = '该问答已标记为已回复，可回到问答管理中按状态筛选查看。'
  toastOpen.value = true
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="问答详情" description="查看问答上下文并提交商家回复。" :show-search="false" :show-filter="false">
      <template #actions>
        <RouterLink class="btn-secondary shrink-0" to="/questions">
          <ArrowLeft class="size-4" />
          返回列表
        </RouterLink>
      </template>
    </PageToolbar>

    <section v-if="question" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div class="card p-5">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-extrabold text-slate-950">{{ question.productName }}</h2>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-500">
            {{ productTypeLabels[question.type] }}
          </span>
          <StatusBadge :status="question.status" />
        </div>
        <div class="mt-5 rounded-lg bg-slate-50 p-5 ring-1 ring-slate-200">
          <p class="text-xs font-bold text-slate-400">{{ question.user }} · {{ question.createdAt }}</p>
          <p class="mt-3 text-base leading-8 text-slate-700">{{ question.question }}</p>
        </div>
        <div class="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          <label class="mb-2 block text-sm font-bold text-slate-700">商家回复</label>
          <textarea v-model="reply" class="input-field min-h-40 resize-none" placeholder="请输入回复内容" />
          <button class="btn-primary mt-4" type="button" @click="submitReply">
            <Send class="size-4" />
            提交回复
          </button>
        </div>
      </div>

      <aside class="card p-5">
        <h2 class="text-lg font-extrabold text-slate-950">回复建议</h2>
        <div class="mt-5 space-y-3 text-sm leading-6 text-slate-600">
          <div class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">先确认使用场景，再给出明确推荐。</div>
          <div class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">如果涉及配送，补充时效和可选安排。</div>
          <div class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">引导用户通过联系入口继续咨询。</div>
        </div>
      </aside>
    </section>

    <section v-else class="card p-8 text-center">
      <h2 class="text-lg font-extrabold text-slate-950">没有找到问答</h2>
      <p class="mt-2 text-sm text-slate-500">请返回问答列表重新选择。</p>
    </section>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
