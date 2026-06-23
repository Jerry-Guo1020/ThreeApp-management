<script setup lang="ts">
import { X } from '@lucide/vue'

import { menuGroups } from '@/config/menu'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" @click="emit('close')" />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0"
    :class="props.open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-16 items-center justify-between border-b border-slate-200 px-5">
      <RouterLink class="flex items-center gap-3" to="/dashboard" @click="emit('close')">
        <span class="flex size-10 items-center justify-center rounded-lg bg-teal-700 text-lg font-black text-white">T</span>
        <span>
          <span class="block text-sm font-extrabold text-slate-950">ThreeApp</span>
          <span class="block text-xs font-bold text-slate-400">admin shell</span>
        </span>
      </RouterLink>
      <button class="icon-button lg:hidden" type="button" aria-label="关闭菜单" @click="emit('close')">
        <X class="size-5" />
      </button>
    </div>

    <nav class="flex-1 space-y-7 overflow-y-auto px-4 py-5">
      <section v-for="group in menuGroups" :key="group.title">
        <h2 class="px-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">{{ group.title }}</h2>
        <div class="mt-3 space-y-1">
          <RouterLink
            v-for="item in group.items"
            :key="item.path"
            class="group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-teal-700"
            :to="item.path"
            active-class="!bg-teal-50 !text-teal-700 ring-1 ring-inset ring-teal-100"
            @click="emit('close')"
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-500 group-[.router-link-active]:bg-white group-[.router-link-active]:text-teal-700"
            >
              {{ item.badge }}
            </span>
          </RouterLink>
        </div>
      </section>
    </nav>

    <div class="border-t border-slate-200 p-4">
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-sm font-extrabold text-slate-900">Tailwind UI v2</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">按 SVG 审核稿组件化实现，可继续接入真实接口。</p>
      </div>
    </div>
  </aside>
</template>
