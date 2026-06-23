<script setup lang="ts">
import { MessagesSquare } from '@lucide/vue'

import CommentList from './CommentList.vue'
import type { CommentItem } from '@/data/mockData'

const props = withDefaults(
  defineProps<{
    comments: CommentItem[]
    imageOnly?: boolean
    rating?: number | null
  }>(),
  {
    imageOnly: false,
    rating: null,
  },
)

const emit = defineEmits<{
  reply: [comment: CommentItem]
  pin: [commentId: string]
  remove: [commentId: string]
  toggleImageOnly: []
  setRating: [rating: number | null]
}>()
</script>

<template>
  <section class="card p-5">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="flex items-center gap-2 text-lg font-extrabold text-slate-950">
          <MessagesSquare class="size-5 text-teal-700" />
          全部评论与二级评论
        </h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">回复、置顶、删除都在具体评论项内完成，适合同一商品存在多条待回复评论的场景。</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="btn-secondary h-9 min-h-9 px-3 text-xs" type="button" @click="emit('toggleImageOnly')">
          {{ props.imageOnly ? '取消有图筛选' : '有图评论' }}
        </button>
        <button
          v-for="score in [5, 4, 3, 2, 1]"
          :key="score"
          class="btn-secondary h-9 min-h-9 px-3 text-xs"
          :class="props.rating === score ? '!bg-teal-50 !text-teal-700 !ring-1 !ring-teal-100' : ''"
          type="button"
          @click="emit('setRating', props.rating === score ? null : score)"
        >
          {{ score }} 星
        </button>
      </div>
    </div>
    <CommentList :comments="props.comments" :image-only="props.imageOnly" :rating="props.rating" @reply="emit('reply', $event)" @pin="emit('pin', $event)" @remove="emit('remove', $event)" />
  </section>
</template>
