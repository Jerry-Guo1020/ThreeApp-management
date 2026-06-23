<script setup lang="ts">
import { ChevronDown, LogOut, Menu, UserCog, UserRound } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { currentUser, getCurrentUserRoleLabel, logoutCurrentUser } from '@/stores/user'

const props = defineProps<{
  title: string
  description?: string
}>()

const emit = defineEmits<{
  menu: []
}>()

const router = useRouter()
const menuOpen = ref(false)
const roleLabel = computed(() => getCurrentUserRoleLabel())
const userName = computed(() => currentUser.value?.name ?? '未登录')
const userEmail = computed(() => currentUser.value?.email ?? '暂无账号信息')

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function logout() {
  logoutCurrentUser()
  menuOpen.value = false
  await router.push('/login')
}
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

      <div class="relative">
        <button
          class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
          type="button"
          @click="toggleMenu"
        >
          <span class="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <UserRound class="size-4" />
          </span>
          <span class="hidden text-left sm:block">
            <span class="block leading-4 text-slate-900">{{ userName }}</span>
            <span class="block text-xs font-medium text-slate-500">{{ roleLabel }}</span>
          </span>
          <ChevronDown class="size-4" />
        </button>

        <div v-if="menuOpen" class="absolute right-0 top-12 z-20 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
          <div class="rounded-lg px-3 py-2">
            <p class="text-sm font-extrabold text-slate-950">{{ userName }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ userEmail }}</p>
          </div>
          <RouterLink class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" to="/settings" @click="menuOpen = false">
            <UserCog class="size-4" />
            用户管理
          </RouterLink>
          <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-50" type="button" @click="logout">
            <LogOut class="size-4" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
