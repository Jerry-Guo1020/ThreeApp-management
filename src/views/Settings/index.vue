<script setup lang="ts">
import { computed, ref } from 'vue'
import { ShieldCheck, UserCog, UserPlus, UserRoundX } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { roleLabels, type UserRole } from '@/data/mockData'
import { addManagedUser, currentUser, isAdminUser, removeManagedUser, toggleManagedUserStatus, updateManagedUserRole, userAccountState } from '@/stores/user'

const createOpen = ref(false)
const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'editor' as UserRole,
})

const canManageUsers = computed(() => isAdminUser())
const users = computed(() => userAccountState.value)
const currentUserName = computed(() => currentUser.value?.name ?? '未登录')

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'editor',
  }
}

function addUser() {
  if (!canManageUsers.value) {
    openToast('error', '无权限操作', '只有管理员可以新增用户。')
    return
  }

  const result = addManagedUser(form.value)
  if (!result.ok) {
    openToast('error', '新增失败', result.message)
    return
  }

  createOpen.value = false
  resetForm()
  openToast('success', '新增成功', '新用户已加入系统，可使用设置的账号密码登录。')
}

function changeRole(userId: string, event: Event) {
  if (!canManageUsers.value) {
    openToast('error', '无权限操作', '只有管理员可以调整用户权限。')
    return
  }

  const role = (event.target as HTMLSelectElement).value as UserRole
  const result = updateManagedUserRole(userId, role)

  if (!result.ok) {
    openToast('error', '调整失败', result.message)
    return
  }

  openToast('success', '权限已更新', '用户角色已调整。')
}

function toggleStatus(userId: string) {
  if (!canManageUsers.value) {
    openToast('error', '无权限操作', '只有管理员可以停用或启用用户。')
    return
  }

  const result = toggleManagedUserStatus(userId)
  if (!result.ok) {
    openToast('error', '操作失败', result.message)
    return
  }

  openToast('success', '状态已更新', '用户状态已切换。')
}

function removeUser(userId: string) {
  if (!canManageUsers.value) {
    openToast('error', '无权限操作', '只有管理员可以删除用户。')
    return
  }

  const result = removeManagedUser(userId)
  if (!result.ok) {
    openToast('error', '删除失败', result.message)
    return
  }

  openToast('success', '删除成功', '用户已从系统中移除。')
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar title="系统设置" description="管理员维护用户账号、角色权限和可用状态。" :show-search="false" :show-filter="false">
      <template #actions>
        <button class="btn-primary shrink-0 sm:w-auto" type="button" :disabled="!canManageUsers" @click="createOpen = true">
          <UserPlus class="size-4" />
          新增用户
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <article class="card p-5">
        <div class="mb-5 flex items-center gap-2">
          <UserCog class="size-5 text-teal-700" />
          <h2 class="text-lg font-extrabold text-slate-950">用户管理</h2>
        </div>
        <div class="space-y-3">
          <article v-for="user in users" :key="user.id" class="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-extrabold text-slate-950">{{ user.name }}</h3>
                  <StatusBadge :status="user.status === 'active' ? 'published' : 'hidden'" :label="user.status === 'active' ? '启用中' : '已停用'" />
                  <StatusBadge :status="user.role === 'admin' ? 'published' : 'draft'" :label="roleLabels[user.role]" />
                </div>
                <p class="mt-2 text-sm text-slate-500">{{ user.email }}</p>
                <p class="mt-1 text-xs font-bold text-slate-400">最近登录：{{ user.lastLogin }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <select
                  class="input-field h-9 min-h-9 w-32 px-3 py-0 text-xs"
                  :disabled="!canManageUsers"
                  :value="user.role"
                  @change="changeRole(user.id, $event)"
                >
                  <option value="admin">管理员</option>
                  <option value="editor">普通用户</option>
                </select>
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs" type="button" :disabled="!canManageUsers || user.role === 'admin'" @click="toggleStatus(user.id)">
                  {{ user.status === 'active' ? '停用' : '启用' }}
                </button>
                <button class="btn-secondary h-9 min-h-9 px-3 text-xs text-rose-700" type="button" :disabled="!canManageUsers || user.role === 'admin'" @click="removeUser(user.id)">
                  <UserRoundX class="size-4" />
                  删除
                </button>
              </div>
            </div>
          </article>
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
          <p>只有管理员能新增、删除用户和调整用户状态。</p>
          <p>普通用户可登录后台，但没有用户管理权限，也不能修改其他账户。</p>
          <p>管理员权限最高，管理员账户不能被删除，系统也至少保留一个管理员。</p>
        </div>
      </aside>
    </section>

    <div v-if="createOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="createOpen = false">
      <section class="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <header class="border-b border-slate-200 px-5 py-4">
          <h2 class="text-lg font-extrabold text-slate-950">新增用户</h2>
          <p class="mt-1 text-sm text-slate-500">管理员创建后台账号并分配权限。</p>
        </header>
        <div class="grid gap-4 p-5 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-bold text-slate-700">用户名称</span>
            <input v-model="form.name" class="input-field" placeholder="例如：运营小王" />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-bold text-slate-700">登录账号</span>
            <input v-model="form.email" class="input-field" placeholder="例如：editor@threeapp.com" />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-bold text-slate-700">初始密码</span>
            <input v-model="form.password" class="input-field" placeholder="请输入初始密码" />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-bold text-slate-700">角色权限</span>
            <select v-model="form.role" class="input-field">
              <option value="editor">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </label>
        </div>
        <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
          <button class="btn-secondary sm:w-auto" type="button" @click="createOpen = false">取消</button>
          <button class="btn-primary sm:w-auto" type="button" @click="addUser">
            <UserPlus class="size-4" />
            确认新增
          </button>
        </footer>
      </section>
    </div>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
