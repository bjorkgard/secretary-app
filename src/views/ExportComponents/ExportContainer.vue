<template>
  <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt class="text-sm font-medium text-slate-400">
      {{ name }}
    </dt>
    <dd class="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">
      <ul
        role="list"
        class="divide-y divide-slate-400 rounded-md border border-slate-400"
      >
        <ExportLink
          v-for="exp in exports"
          :key="exp.function"
          :object="exp"
        />
      </ul>
    </dd>
  </div>
</template>

<script setup>
import ExportLink from './ExportLink.vue'

defineProps({
    name    : { type: String, required: true },
    exports : { type: Array, default: () => [] },
})
</script>
