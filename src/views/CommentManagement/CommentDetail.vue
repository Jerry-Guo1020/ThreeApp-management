<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, MessageSquareReply } from '@lucide/vue'

import CommentReplyModal from '@/components/comment/CommentReplyModal.vue'
import CommentThread from '@/components/comment/CommentThread.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { getCommentsByProduct, getProductById, productTypeLabels, type ProductType } from '@/data/mockData'

const props = defineProps<{
  type: ProductType
  productId: string
}>()

const replyOpen = ref(false)
const product = computed(() => getProductById(props.productId))
const comments = computed(() => getCommentsByProduct(props.productId))
const fallbackTitle = computed(() => (props.type ? `${productTypeLabels[props.type]}评论详情` : '评论详情'))
</script>

<template>
  <div class="space-y-6">
    <PageToolbar
      :title="product ? `${product.name} · 评论详情` : fallbackTitle"
      description="查看全部评论、二级评论、商家回复、置顶和删除确认状态。"
      search-placeholder="搜索评论内容"
    >
      <template #actions>
        <RouterLink class="btn-secondary shrink-0" :to="`/comments/${props.type}`">
          <ArrowLeft class="size-4" />
          返回入口
        </RouterLink>
        <button class="btn-primary shrink-0" type="button" @click="replyOpen = true">
          <MessageSquareReply class="size-4" />
          回复评论
        </button>
      </template>
    </PageToolbar>

    <section v-if="product" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <CommentThread :comments="comments" />

      <aside class="space-y-6">
        <section class="card p-5">
          <h2 class="text-lg font-extrabold text-slate-950">商品摘要</h2>
          <div class="mt-4 flex items-center gap-3">
            <div class="size-16 rounded-lg bg-gradient-to-br" :class="product.imageTone" />
            <div class="min-w-0">
              <p class="truncate font-extrabold text-slate-950">{{ product.name }}</p>
              <p class="mt-1 truncate text-sm text-slate-500">{{ product.subtitle }}</p>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p class="text-2xl font-black text-slate-950">{{ product.comments }}</p>
              <p class="text-xs font-bold text-slate-500">评论</p>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p class="text-2xl font-black text-slate-950">{{ product.replies }}</p>
              <p class="text-xs font-bold text-slate-500">二级回复</p>
            </div>
          </div>
        </section>

        <section class="card p-5">
          <h2 class="text-lg font-extrabold text-slate-950">回复评论弹窗</h2>
          <p class="mt-1 text-sm leading-6 text-slate-500">弹窗中提供回复、置顶、标记处理和删除确认。</p>
          <div class="mt-5 space-y-3 rounded-lg bg-slate-50 p-4">
            <div class="rounded-lg bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">输入商家回复...</div>
            <div class="flex flex-wrap gap-2">
              <StatusBadge status="published" label="置顶" />
              <StatusBadge status="pending" label="标记处理" />
              <StatusBadge status="hidden" label="删除确认" />
            </div>
          </div>
        </section>
      </aside>
    </section>

    <section v-else class="card p-8 text-center">
      <h2 class="text-lg font-extrabold text-slate-950">没有找到商品</h2>
      <p class="mt-2 text-sm text-slate-500">请返回评论管理入口重新选择商品。</p>
    </section>

    <CommentReplyModal :open="replyOpen" @close="replyOpen = false" />
  </div>
</template>
