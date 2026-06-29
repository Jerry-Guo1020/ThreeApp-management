import { computed, ref } from 'vue'

import { setAuthenticated } from './app'
import { readStorage, removeStorage, writeStorage } from './persistence'
import {
  PREVIEW_LOGIN_DEFAULTS,
  clearPreviewWorkspace,
  getPreviewUserAccounts,
  isPreviewSessionActive,
  seedPreviewWorkspace,
  setStoredSessionMode,
  type SessionMode,
} from './preview'
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
const PREVIEW_TOKEN = 'preview-session-token'

export const userAccountState = ref<AdminUser[]>(readStorage<AdminUser[]>(USER_STORAGE_KEY, []))
export const currentUser = ref<AdminUser | null>(readStorage<AdminUser | null>(CURRENT_USER_STORAGE_KEY, null))
export const authLoading = ref(false)
export const authError = ref('')
export const sessionMode = ref<SessionMode>(isPreviewSessionActive() ? 'preview' : 'remote')

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

function toPreviewUser(record: { id: string; name: string; email: string; role: 'admin' | 'editor'; status: 'active' | 'disabled'; lastLogin: string }): AdminUser {
  return {
    id: record.id,
    name: record.name,
    username: record.email,
    email: record.email,
    role: record.role,
    status: record.status,
    lastLogin: record.lastLogin,
  }
}

function getPreviewUsers() {
  return getPreviewUserAccounts().map(toPreviewUser)
}

function resolvePreviewUser(username: string) {
  const previewUsers = getPreviewUsers()
  const normalizedUsername = username.trim().toLowerCase()

  return previewUsers.find((item) => item.email.toLowerCase() === normalizedUsername) ?? previewUsers[0] ?? null
}

function persistSession(mode: SessionMode, token: string, user: AdminUser | null) {
  sessionMode.value = mode
  setStoredSessionMode(mode)
  setAdminToken(token)

  if (typeof window !== 'undefined') {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  currentUser.value = user
  userAccountState.value = mode === 'preview' ? getPreviewUsers() : user ? [user] : []
  persistUsers()
  persistCurrentUser()
  setAuthenticated(Boolean(user))
}

function activatePreviewSession(username: string, message: string) {
  const previewUser = resolvePreviewUser(username)
  if (!previewUser) {
    persistSession('remote', '', null)
    return {
      ok: false as const,
      message,
    }
  }

  seedPreviewWorkspace()
  persistSession('preview', PREVIEW_TOKEN, previewUser)
  authError.value = message

  return {
    ok: true as const,
    user: previewUser,
    mode: 'preview' as const,
    message,
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

    clearPreviewWorkspace()
    const nextUser = toUser(response.data.admin)
    persistSession('remote', response.data.token, nextUser)

    return {
      ok: true as const,
      user: nextUser,
      mode: 'remote' as const,
    }
  } catch (error) {
    const message = getErrorMessage(error, '登录服务暂时不可用，已切换到本地预览模式。')
    return activatePreviewSession(username, message)
  } finally {
    authLoading.value = false
  }
}

export async function hydrateCurrentUser() {
  const token = typeof window === 'undefined' ? '' : window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
  const previewMode = isPreviewSessionActive()

  if (!token) {
    if (previewMode) {
      activatePreviewSession(PREVIEW_LOGIN_DEFAULTS.username, '当前正在使用本地预览模式。')
      return
    }

    persistSession('remote', '', null)
    return
  }

  setAdminToken(token)
  authLoading.value = true
  authError.value = ''

  if (previewMode || token === PREVIEW_TOKEN) {
    activatePreviewSession(currentUser.value?.email ?? PREVIEW_LOGIN_DEFAULTS.username, '当前正在使用本地预览模式。')
    authLoading.value = false
    return
  }

  try {
    const response = await request<any>('/api/admin/auth/me')
    clearPreviewWorkspace()
    persistSession('remote', token, toUser(response.data))
  } catch (error) {
    const message = getErrorMessage(error, '登录态校验失败，已切换到本地预览模式。')
    activatePreviewSession(currentUser.value?.email ?? PREVIEW_LOGIN_DEFAULTS.username, message)
  } finally {
    authLoading.value = false
  }
}

export function logoutCurrentUser() {
  authError.value = ''
  persistSession('remote', '', null)
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
export const isPreviewMode = computed(() => sessionMode.value === 'preview')
