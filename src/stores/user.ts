import { computed, ref } from 'vue'

import { roleLabels, userAccounts as userSeed, type UserAccount, type UserRole } from '@/data/mockData'

import { setAuthenticated } from './app'
import { readStorage, removeStorage, writeStorage } from './persistence'

const USER_STORAGE_KEY = 'threeapp-users'
const CURRENT_USER_STORAGE_KEY = 'threeapp-current-user'

export const userAccountState = ref<UserAccount[]>(readStorage(USER_STORAGE_KEY, userSeed))
export const currentUser = ref<UserAccount | null>(readStorage<UserAccount | null>(CURRENT_USER_STORAGE_KEY, null))

function formatNow() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

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

function syncCurrentUser() {
  if (!currentUser.value) return

  const matchedUser = userAccountState.value.find((user) => user.id === currentUser.value?.id)

  if (!matchedUser || matchedUser.status === 'disabled') {
    currentUser.value = null
    persistCurrentUser()
    setAuthenticated(false)
    return
  }

  currentUser.value = { ...matchedUser }
  persistCurrentUser()
}

syncCurrentUser()

export function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const targetUser = userAccountState.value.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (!targetUser || targetUser.password !== password) {
    return {
      ok: false as const,
      message: '账号或密码不正确。',
    }
  }

  if (targetUser.status === 'disabled') {
    return {
      ok: false as const,
      message: '该账号已被停用，请联系管理员。',
    }
  }

  const lastLogin = formatNow()

  userAccountState.value = userAccountState.value.map((user) => {
    if (user.id !== targetUser.id) return user
    return {
      ...user,
      lastLogin,
    }
  })
  persistUsers()

  currentUser.value = { ...targetUser, lastLogin }
  persistCurrentUser()
  setAuthenticated(true)

  return {
    ok: true as const,
    user: currentUser.value,
  }
}

export function logoutCurrentUser() {
  currentUser.value = null
  persistCurrentUser()
  setAuthenticated(false)
}

export function addManagedUser(payload: { name: string; email: string; password: string; role: UserRole }) {
  const normalizedEmail = payload.email.trim().toLowerCase()

  if (!payload.name.trim() || !normalizedEmail || !payload.password.trim()) {
    return { ok: false as const, message: '请完整填写用户名称、账号和密码。' }
  }

  if (userAccountState.value.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return { ok: false as const, message: '该账号已存在，请更换邮箱。' }
  }

  const nextUser: UserAccount = {
    id: `user-${Date.now()}`,
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password.trim(),
    role: payload.role,
    status: 'active',
    lastLogin: '未登录',
  }

  userAccountState.value = [nextUser, ...userAccountState.value]
  persistUsers()
  syncCurrentUser()

  return { ok: true as const, user: nextUser }
}

export function updateManagedUserRole(userId: string, role: UserRole) {
  const targetUser = userAccountState.value.find((user) => user.id === userId)
  if (!targetUser) return { ok: false as const, message: '没有找到对应用户。' }

  const adminCount = userAccountState.value.filter((user) => user.role === 'admin').length
  if (targetUser.role === 'admin' && role !== 'admin' && adminCount === 1) {
    return { ok: false as const, message: '系统至少需要保留一个管理员账号。' }
  }

  userAccountState.value = userAccountState.value.map((user) => (user.id === userId ? { ...user, role } : user))
  persistUsers()
  syncCurrentUser()

  return { ok: true as const }
}

export function toggleManagedUserStatus(userId: string) {
  const targetUser = userAccountState.value.find((user) => user.id === userId)
  if (!targetUser) return { ok: false as const, message: '没有找到对应用户。' }
  if (targetUser.role === 'admin') return { ok: false as const, message: '管理员账号不能停用。' }

  userAccountState.value = userAccountState.value.map((user) => {
    if (user.id !== userId) return user
    return { ...user, status: user.status === 'active' ? 'disabled' : 'active' }
  })
  persistUsers()
  syncCurrentUser()

  return { ok: true as const }
}

export function removeManagedUser(userId: string) {
  const targetUser = userAccountState.value.find((user) => user.id === userId)
  if (!targetUser) return { ok: false as const, message: '没有找到对应用户。' }
  if (targetUser.role === 'admin') return { ok: false as const, message: '管理员账号不能删除。' }

  userAccountState.value = userAccountState.value.filter((user) => user.id !== userId)
  persistUsers()
  syncCurrentUser()

  return { ok: true as const }
}

export function isAdminUser(role = currentUser.value?.role) {
  return role === 'admin'
}

export function getCurrentUserRoleLabel() {
  if (!currentUser.value) return '未登录'
  return roleLabels[currentUser.value.role]
}

export const currentUserRoleLabel = computed(() => getCurrentUserRoleLabel())
