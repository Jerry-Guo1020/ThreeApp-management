<script setup lang="ts">
import { KeyRound, LogIn, Mail } from '@lucide/vue'
</script>

<template>
  <main class="grid min-h-screen bg-slate-100 p-4 lg:grid-cols-[420px_minmax(0,1fr)] lg:p-8">
    <section class="flex flex-col justify-between rounded-t-lg bg-teal-700 p-8 text-white lg:rounded-l-lg lg:rounded-tr-none">
      <div>
        <div class="flex size-12 items-center justify-center rounded-lg bg-white text-2xl font-black text-teal-700">T</div>
        <h1 class="mt-12 text-4xl font-black tracking-normal">ThreeApp</h1>
        <p class="mt-3 text-lg font-bold text-teal-100">商品内容管理平台</p>
        <p class="mt-10 max-w-sm text-sm leading-7 text-emerald-100">
          管理酒水、特产、评论、问答、首页内容和素材，后台结构按 Tailwind CSS 审核稿实现。
        </p>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
          <p class="text-2xl font-black">24</p>
          <p class="mt-1 text-xs font-bold text-teal-100">商品</p>
        </div>
        <div class="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
          <p class="text-2xl font-black">86</p>
          <p class="mt-1 text-xs font-bold text-teal-100">评论</p>
        </div>
        <div class="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
          <p class="text-2xl font-black">12</p>
          <p class="mt-1 text-xs font-bold text-teal-100">问答</p>
        </div>
      </div>
    </section>

    <section class="flex items-center justify-center rounded-b-lg bg-white p-6 shadow-sm lg:rounded-r-lg lg:rounded-bl-none">
      <form class="w-full max-w-md space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-950">管理员登录</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">Tailwind 表单布局：space-y-5 + rounded-lg inputs</p>
        </div>

        <label class="block">
          <span class="mb-2 block text-sm font-bold text-slate-700">账号</span>
          <span class="relative block">
            <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input class="input-field pl-9" value="admin@threeapp.com" />
          </span>
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-bold text-slate-700">密码</span>
          <span class="relative block">
            <KeyRound class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input class="input-field pl-9" type="password" value="password" />
          </span>
        </label>

        <RouterLink class="btn-primary w-full" to="/dashboard">
          <LogIn class="size-4" />
          登录
        </RouterLink>
      </form>
    </section>
  </main>
</template>
