<template>
  <button
    type="button"
    class="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm ring-offset-slate-100 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-slate-500 dark:text-slate-800 dark:border-slate-800 dark:ring-offset-slate-700 dark:hover:bg-slate-400"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
    label: { type: String, default: 'Avbryt' },
})
</script>
