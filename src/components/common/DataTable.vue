<template>
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column"
              scope="col"
              class="whitespace-nowrap px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: string[]
}>()
</script>
