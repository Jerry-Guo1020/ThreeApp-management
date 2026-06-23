<script setup lang="ts">
import { computed } from 'vue'
import { MessageSquareReply, Pin, Star, Trash2 } from '@lucide/vue'

import StatusBadge from '@/components/common/StatusBadge.vue'
import type { CommentItem } from '@/data/mockData'

const props = defineProps<{
  comments: CommentItem[]
}>()

const sortedComments = computed(() => [...props.comments].sort((a, b) => Number(b.pinned) - Number(a.pinned)))
</script>

<template>
  <div class="space-y-4">
    <article
      v-for="comment in sortedComments"
      :key="comment.id"
      class="rounded-lg border border-slate-200 bg-slate-50 p-4"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-extrabold text-slate-950">{{ comment.author }}</h3>
            <span class="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
              <Star v-for="index in comment.rating" :key="index" class="size-3.5 fill-current" />
            </span>
            <StatusBadge v-if="comment.pinned" status="published" label="置顶" />
          </div>
          <p class="mt-1 text-xs font-bold text-slate-400">{{ comment.createdAt }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-secondary h-9 min-h-9 px-3 text-xs" type="button">
            <MessageSquareReply class="size-4" />
            回复
          </button>
          <button class="icon-button h-9 w-9" type="button" aria-label="置顶评论">
            <Pin class="size-4" />
          </button>
          <button class="icon-button h-9 w-9 text-rose-600" type="button" aria-label="删除评论">
            <Trash2 class="size-4" />
          </button>
        </div>
      </div>

      <p class="mt-3 text-sm leading-6 text-slate-700">{{ comment.content }}</p>

      <div v-if="comment.images" class="mt-3 flex gap-2">
        <div
          v-for="imageIndex in comment.images"
          :key="imageIndex"
          class="h-14 w-16 rounded-md bg-gradient-to-br from-slate-100 to-slate-300"
        />
      </div>

      <div v-if="comment.reply" class="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span class="font-extrabold text-teal-700">商家回复：</span>{{ comment.reply }}
      </div>
    </article>
  </div>
</template>
