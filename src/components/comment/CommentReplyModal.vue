<script setup lang="ts">
import { Send, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import type { CommentItem } from '@/data/mockData'

const props = defineProps<{
  open: boolean
  comment?: CommentItem | null
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { id: string; reply: string }]
}>()

const replyText = ref('')

watch(
  () => props.comment,
  (comment) => {
    replyText.value = comment?.reply ?? ''
  },
  { immediate: true },
)

const isEdit = computed(() => Boolean(props.comment?.reply))

function handleSubmit() {
  if (!props.comment) return
  emit('submit', { id: props.comment.id, reply: replyText.value.trim() })
}
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="emit('close')">
    <section class="w-full max-w-md rounded-lg bg-white shadow-2xl">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <h2 class="text-lg font-extrabold text-slate-950">{{ isEdit ? '修改回复' : '回复评论' }}</h2>
          <p class="text-xs text-slate-500">{{ props.comment?.author }} · {{ props.comment?.createdAt }}</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭" @click="emit('close')">
          <X class="size-5" />
        </button>
      </header>

      <div class="space-y-5 p-5">
        <div class="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {{ props.comment?.content }}
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold text-slate-700">回复内容</label>
          <textarea v-model="replyText" class="input-field min-h-32 resize-none" placeholder="输入商家回复内容" />
        </div>
      </div>

      <footer class="flex justify-end gap-3 border-t border-slate-200 p-5">
        <button class="btn-secondary" type="button" @click="emit('close')">取消</button>
        <button class="btn-primary" type="button" @click="handleSubmit">
          <Send class="size-4" />
          提交回复
        </button>
      </footer>
    </section>
  </div>
</template>
