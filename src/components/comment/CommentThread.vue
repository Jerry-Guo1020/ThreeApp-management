<script setup lang="ts">
import { MessagesSquare } from '@lucide/vue'

import CommentList from './CommentList.vue'
import type { CommentItem } from '@/data/mockData'

const props = defineProps<{
  comments: CommentItem[]
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
        <p class="mt-1 text-sm leading-6 text-slate-500">默认前台展示，后台主要用于回复、置顶和删除不合适内容。</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary h-9 min-h-9 px-3 text-xs" type="button">有图评论</button>
        <button class="btn-secondary h-9 min-h-9 px-3 text-xs" type="button">按评分筛选</button>
      </div>
    </div>
    <CommentList :comments="props.comments" />
  </section>
</template>
