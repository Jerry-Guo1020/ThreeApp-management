import { reactive } from 'vue'

const AUTH_STORAGE_KEY = 'threeapp-authenticated'

function getInitialAuthState() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export const appState = reactive({
  isAuthenticated: getInitialAuthState(),
  sidebarCollapsed: false,
  theme: 'light',
})

export function setAuthenticated(value: boolean) {
  appState.isAuthenticated = value

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_STORAGE_KEY, String(value))
  }
}
