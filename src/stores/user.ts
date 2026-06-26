import { computed, ref } from 'vue'

import { setAuthenticated } from './app'
import { readStorage, removeStorage, writeStorage } from './persistence'
import { getErrorMessage, request, setAdminToken } from '@/utils/request'

export interface AdminUser {
  id: string
  name: string
  username: string
  email: string
  role: 'admin' | 'editor'
  status: 'active' | 'disabled'
  lastLogin: string
}

const USER_STORAGE_KEY = 'threeapp-users'
const CURRENT_USER_STORAGE_KEY = 'threeapp-current-user'
const TOKEN_STORAGE_KEY = 'threeapp-admin-token'

export const userAccountState = ref<AdminUser[]>(readStorage<AdminUser[]>(USER_STORAGE_KEY, []))
export const currentUser = ref<AdminUser | null>(readStorage<AdminUser | null>(CURRENT_USER_STORAGE_KEY, null))
export const authLoading = ref(false)
export const authError = ref('')

function persistUsers() {
  writeStorage(USER_STORAGE_KEY, userAccountState.value)
}

function persistCurrentUser() {
  if (!currentUser.value) {
    removeStorage(CURRENT_USER_STORAGE_KEY)
    return
  }

  writeStorage(CURRENT_USER_STORAGE_KEY, currentUser.value)
}

function toUser(record: any): AdminUser {
  return {
    id: String(record.id ?? ''),
    name: record.name ?? 'null',
    username: record.username ?? 'null',
    email: record.username ?? 'null',
    role: record.roleKey === 'super_admin' ? 'admin' : 'editor',
    status: 'active',
    lastLogin: record.lastLoginAt ?? 'null',
  }
}

const storedToken = typeof window === 'undefined' ? '' : window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
setAdminToken(storedToken)
if (storedToken && currentUser.value) {
  setAuthenticated(true)
}

export async function authenticateUser(username: string, password: string) {
  authLoading.value = true
  authError.value = ''

  try {
    const response = await request<{ token: string; admin: any }>('/api/admin/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ username, password }),
    })

    setAdminToken(response.data.token)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token)
    }

    currentUser.value = toUser(response.data.admin)
    userAccountState.value = currentUser.value ? [currentUser.value] : []
    persistUsers()
    persistCurrentUser()
    setAuthenticated(true)

    return {
      ok: true as const,
      user: currentUser.value,
    }
  } catch (error) {
    authError.value = getErrorMessage(error, '账号或密码不正确。')
    setAdminToken('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    currentUser.value = null
    userAccountState.value = []
    persistUsers()
    persistCurrentUser()
    setAuthenticated(false)

    return {
      ok: false as const,
      message: authError.value,
    }
  } finally {
    authLoading.value = false
  }
}

export async function hydrateCurrentUser() {
  const token = typeof window === 'undefined' ? '' : window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
  if (!token) {
    currentUser.value = null
    userAccountState.value = []
    persistUsers()
    persistCurrentUser()
    setAuthenticated(false)
    return
  }

  setAdminToken(token)
  authLoading.value = true
  authError.value = ''

  try {
    const response = await request<any>('/api/admin/auth/me')
    currentUser.value = toUser(response.data)
    userAccountState.value = currentUser.value ? [currentUser.value] : []
    persistUsers()
    persistCurrentUser()
    setAuthenticated(true)
  } catch (error) {
    authError.value = getErrorMessage(error)
    logoutCurrentUser()
  } finally {
    authLoading.value = false
  }
}

export function logoutCurrentUser() {
  currentUser.value = null
  userAccountState.value = []
  persistUsers()
  persistCurrentUser()
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
  setAdminToken('')
  setAuthenticated(false)
}

export function addManagedUser() {
  return { ok: false as const, message: '当前后端暂未开放后台用户管理接口。' }
}

export function updateManagedUserRole() {
  return { ok: false as const, message: '当前后端暂未开放后台用户管理接口。' }
}

export function toggleManagedUserStatus() {
  return { ok: false as const, message: '当前后端暂未开放后台用户管理接口。' }
}

export function removeManagedUser() {
  return { ok: false as const, message: '当前后端暂未开放后台用户管理接口。' }
}

export function isAdminUser(role = currentUser.value?.role) {
  return role === 'admin'
}

export function getCurrentUserRoleLabel() {
  if (!currentUser.value) return '未登录'
  return currentUser.value.role === 'admin' ? '管理员' : '普通用户'
}

export const currentUserRoleLabel = computed(() => getCurrentUserRoleLabel())
