<template>
  <button
    :type="type"
    class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-slate-100 shadow-sm ring-offset-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="isSubmitting"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
    isSubmitting : { type: Boolean, default: false },
    label        : { type: String, default: 'Spara' },
    type         : { type: String, default: 'submit' },
})
</script>
