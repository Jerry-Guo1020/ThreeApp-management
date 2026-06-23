<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const title = computed(() => String(route.meta.title ?? 'ThreeApp'))
const description = computed(() => String(route.meta.description ?? '商品内容管理平台'))

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 app-surface">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="min-w-0 flex-1">
      <AppHeader :title="title" :description="description" @menu="sidebarOpen = true" />
      <main class="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
