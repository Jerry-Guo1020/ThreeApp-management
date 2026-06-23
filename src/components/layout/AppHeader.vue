<script setup lang="ts">
import { Bell, Menu, Plus, Search, UserRound } from '@lucide/vue'

const props = defineProps<{
  title: string
  description?: string
}>()

const emit = defineEmits<{
  menu: []
}>()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="flex min-h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
      <button class="icon-button lg:hidden" type="button" aria-label="打开菜单" @click="emit('menu')">
        <Menu class="size-5" />
      </button>

      <div class="min-w-0 flex-1">
        <h1 class="truncate text-lg font-extrabold text-slate-950">{{ props.title }}</h1>
        <p v-if="props.description" class="hidden truncate text-xs text-slate-500 sm:block">{{ props.description }}</p>
      </div>

      <label class="relative hidden w-72 xl:block">
        <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input class="input-field h-9 min-h-9 pl-9 text-sm" placeholder="搜索商品、评论、问答" />
      </label>

      <button class="btn-primary hidden sm:inline-flex" type="button">
        <Plus class="size-4" />
        新增内容
      </button>
      <button class="icon-button" type="button" aria-label="消息">
        <Bell class="size-5" />
      </button>
      <button class="icon-button" type="button" aria-label="管理员">
        <UserRound class="size-5" />
      </button>
    </div>
  </header>
</template>
