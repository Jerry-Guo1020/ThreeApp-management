<template>
  <section class="card p-4 sm:p-5">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div class="min-w-0">
        <h1 class="text-xl font-extrabold text-slate-950 sm:text-2xl">{{ title }}</h1>
        <p v-if="description" class="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          {{ description }}
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
        <label v-if="showSearch" class="relative block min-w-0 sm:w-72">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input class="input-field has-leading-icon" :placeholder="searchPlaceholder" />
        </label>
        <button v-if="showFilter" class="btn-secondary shrink-0" type="button">
          <SlidersHorizontal class="size-4" />
          筛选
        </button>
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal } from '@lucide/vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    searchPlaceholder?: string
    showFilter?: boolean
    showSearch?: boolean
  }>(),
  {
    description: '',
    searchPlaceholder: '搜索商品、评论、问答',
    showFilter: true,
    showSearch: true,
  },
)
</script>
