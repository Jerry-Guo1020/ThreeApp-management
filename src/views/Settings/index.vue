<template>
  <div class="space-y-6">
    <PageToolbar title="系统设置" description="管理员维护用户账号、角色权限和可用状态。" :show-search="false" :show-filter="false" />

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <article class="card p-5">
        <div class="mb-5 flex items-center gap-2">
          <UserCog class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">用户管理</h2>
        </div>
        <div v-if="users.length" class="space-y-3">
          <article v-for="user in users" :key="user.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-extrabold text-slate-950">{{ user.name || 'null' }}</h3>
                  <StatusBadge :status="user.status === 'active' ? 'published' : 'hidden'" :label="user.status === 'active' ? '启用中' : '已停用'" />
                  <StatusBadge :status="user.role === 'admin' ? 'published' : 'draft'" :label="roleLabels[user.role]" />
                </div>
                <p class="mt-2 text-sm text-slate-500">{{ user.email || 'null' }}</p>
                <p class="mt-1 text-xs font-bold text-slate-400">最近登录：{{ user.lastLogin || 'null' }}</p>
              </div>
              <div class="text-xs font-bold text-slate-400">当前为只读展示，后端用户管理接口待补充。</div>
            </div>
          </article>
        </div>
        <div v-else class="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          当前没有可展示的后台用户数据，显示 `null`。
        </div>
      </article>

      <aside class="card p-5">
        <div class="mb-5 flex items-center gap-2">
          <ShieldCheck class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">权限说明</h2>
        </div>
        <div class="space-y-4 text-sm leading-6 text-slate-600">
          <div class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            当前登录用户：{{ currentUserName }}
            <div class="mt-2"><StatusBadge :status="canManageUsers ? 'published' : 'draft'" :label="canManageUsers ? '管理员权限' : '普通用户权限'" /></div>
          </div>
          <p>当前这页已经切到真实登录态数据。</p>
          <p>后台用户增删改接口这轮还没有正式开放，所以这里先只读展示，避免假操作。</p>
          <p>等服务器地址、数据库和后台管理接口全部敲定后，再继续补齐用户管理动作。</p>
        </div>
      </aside>
    </section>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="() => undefined" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, UserCog } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { roleLabels } from '@/data/mockData'
import { currentUser, isAdminUser, userAccountState } from '@/stores/user'

const toastOpen = computed(() => false)
const toastTone = computed(() => 'error' as const)
const toastTitle = computed(() => '')
const toastMessage = computed(() => '')

const canManageUsers = computed(() => isAdminUser())
const users = computed(() => userAccountState.value)
const currentUserName = computed(() => currentUser.value?.name ?? '未登录')
</script>
