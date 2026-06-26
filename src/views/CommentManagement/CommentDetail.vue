<template>
  <div class="space-y-6">
    <PageToolbar
      :title="product ? `${product.name} · 评论详情` : fallbackTitle"
      description="查看全部评论、二级评论、商家回复、置顶和删除确认状态。"
      :show-search="false"
      :show-filter="false"
    >
      <template #actions>
        <RouterLink class="btn-secondary shrink-0" :to="`/comments/${props.type}`">
          <ArrowLeft class="size-4" />
          返回入口
        </RouterLink>
      </template>
    </PageToolbar>

    <section v-if="product" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <CommentThread
        :comments="comments"
        :image-only="imageOnly"
        :rating="activeRating"
        @reply="openReply"
        @pin="togglePin"
        @remove="removeComment"
        @toggle-image-only="imageOnly = !imageOnly"
        @set-rating="activeRating = $event"
      />

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
              <p class="text-2xl font-black text-slate-950">{{ comments.filter((item) => !item.deleted).length }}</p>
              <p class="text-xs font-bold text-slate-500">可见评论</p>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p class="text-2xl font-black text-slate-950">{{ unresolvedCount }}</p>
              <p class="text-xs font-bold text-slate-500">待回复</p>
            </div>
          </div>
        </section>

        <section class="card p-5">
          <h2 class="text-lg font-extrabold text-slate-950">当前筛选</h2>
          <div class="mt-5 flex flex-wrap gap-2">
            <StatusBadge :status="imageOnly ? 'published' : 'draft'" :label="imageOnly ? '仅看有图' : '全部评论'" />
            <StatusBadge :status="activeRating ? 'published' : 'draft'" :label="activeRating ? `${activeRating} 星` : '全部评分'" />
          </div>
          <p class="mt-4 text-sm leading-6 text-slate-500">回复操作位于每一条评论内，适合同商品下多条评论分别处理。</p>
        </section>
      </aside>
    </section>

    <section v-else class="card p-8 text-center">
      <h2 class="text-lg font-extrabold text-slate-950">没有找到商品</h2>
      <p class="mt-2 text-sm text-slate-500">请返回评论管理入口重新选择商品。</p>
    </section>

    <CommentReplyModal :open="replyOpen" :comment="activeComment" @close="replyOpen = false" @submit="submitReply" />
    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft } from '@lucide/vue'

import CommentReplyModal from '@/components/comment/CommentReplyModal.vue'
import CommentThread from '@/components/comment/CommentThread.vue'
import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { productTypeLabels, type CommentItem, type ProductType } from '@/data/mockData'
import { commentState, deleteStoredComment, fetchCommentsForProduct, replyToStoredComment, togglePinnedStoredComment } from '@/stores/comments'
import { getErrorMessage } from '@/utils/request'
import { getStoredProductById } from '@/stores/products'

const props = defineProps<{
  type: ProductType
  productId: string
}>()

const replyOpen = ref(false)
const imageOnly = ref(false)
const activeRating = ref<number | null>(null)
const activeComment = ref<CommentItem | null>(null)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')
const actionLoading = ref(false)

const product = computed(() => getStoredProductById(props.productId))
const comments = computed(() => commentState.value.filter((comment) => comment.productId === props.productId))
const fallbackTitle = computed(() => (props.type ? `${productTypeLabels[props.type]}评论详情` : '评论详情'))
const unresolvedCount = computed(() => comments.value.filter((comment) => !comment.deleted && !comment.reply).length)

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function openReply(comment: CommentItem) {
  activeComment.value = comment
  replyOpen.value = true
}

async function submitReply(payload: { id: string; reply: string }) {
  if (!payload.reply.trim()) {
    openToast('error', '回复失败', '请先填写回复内容。')
    return
  }

  actionLoading.value = true
  try {
    await replyToStoredComment(payload.id, payload.reply.trim())
    replyOpen.value = false
    openToast('success', '回复成功', '评论回复已更新，可继续处理其他待回复评论。')
  } catch (error) {
    openToast('error', '回复失败', getErrorMessage(error))
  } finally {
    actionLoading.value = false
  }
}

async function togglePin(commentId: string) {
  actionLoading.value = true
  try {
    await togglePinnedStoredComment(props.productId, commentId)
    openToast('success', '置顶已更新', '当前商品的评论置顶状态已调整。')
  } catch (error) {
    openToast('error', '置顶失败', getErrorMessage(error))
  } finally {
    actionLoading.value = false
  }
}

async function removeComment(commentId: string) {
  actionLoading.value = true
  try {
    await deleteStoredComment(commentId)
    openToast('success', '删除成功', '该评论已从当前列表中移除。')
  } catch (error) {
    openToast('error', '删除失败', getErrorMessage(error))
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  void fetchCommentsForProduct(props.productId)
})
</script>
