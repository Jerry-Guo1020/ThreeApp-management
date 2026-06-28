<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
    <div class="w-full max-w-5xl space-y-6">
      <section class="mx-auto grid w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
        <div class="flex flex-col justify-center bg-teal-700 px-8 py-10 text-white">
          <div class="flex size-11 items-center justify-center rounded-lg bg-white text-xl font-black text-teal-700">T</div>
          <h1 class="mt-8 text-3xl font-black tracking-normal">ThreeApp</h1>
          <p class="mt-3 text-sm leading-7 text-teal-100">商品内容管理平台</p>
        </div>

        <section class="flex items-center justify-center p-6 sm:p-8">
          <form class="w-full max-w-sm space-y-5" @submit.prevent="submit">
            <div>
              <h2 class="text-2xl font-black text-slate-950">管理员登录</h2>
              <p class="mt-2 text-sm leading-6 text-slate-500">当前先开放预览登录，接口不可用时会自动进入本地演示后台。</p>
            </div>

            <label class="block">
              <span class="mb-2 block text-sm font-bold text-slate-700">账号</span>
              <span class="relative block">
                <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input v-model="account" class="input-field has-leading-icon" placeholder="请输入管理员账号" />
              </span>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-bold text-slate-700">密码</span>
              <span class="relative block">
                <KeyRound class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input v-model="password" class="input-field has-leading-icon" type="password" placeholder="请输入管理员密码" />
              </span>
            </label>

            <div class="rounded-lg bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500 ring-1 ring-slate-200">
              预览账号：{{ previewDefaults.username }}
              <br />
              预览密码：{{ previewDefaults.password }}
            </div>

            <p v-if="loginError" class="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
              {{ loginError }}
            </p>

            <button class="btn-primary w-full" type="submit" :disabled="authLoading">
              <LogIn class="size-4" />
              {{ authLoading ? '登录中...' : '进入后台' }}
            </button>
          </form>
        </section>
      </section>

      <div class="mx-auto h-10 max-w-3xl text-center text-xs leading-10 text-slate-400">
        备案信息预留位置
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { KeyRound, LogIn, Mail } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { PREVIEW_LOGIN_DEFAULTS } from '@/stores/preview'
import { authenticateUser, authLoading } from '@/stores/user'

const router = useRouter()
const previewDefaults = PREVIEW_LOGIN_DEFAULTS
const account = ref(previewDefaults.username)
const password = ref(previewDefaults.password)
const loginError = ref('')

async function submit() {
  const result = await authenticateUser(account.value, password.value)

  if (!result.ok) {
    loginError.value = result.message
    return
  }

  loginError.value = result.mode === 'preview' ? result.message : ''
  await router.push('/dashboard')
}
</script>
