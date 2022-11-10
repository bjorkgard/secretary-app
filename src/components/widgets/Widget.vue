<template>
  <div
    class="relative bg-white shadow-lg rounded-lg overflow-hidden dark:bg-slate-700 dark:border dark:border-slate-500"
  >
    <div
      v-if="header"
      class="flex space-x-2 border-b border-slate-200 text-slate-500 px-3 py-2 sm:px-3 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
    >
      <slot name="header" />
    </div>
    <div>
      <slot name="body" />
    </div>
    <div
      v-if="footer"
      class="flex space-x-2 justify-end bg-slate-50 border-t border-slate-200 px-3 py-2 sm:px-3 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  header     : { type: Boolean, default: false },
  footer     : { type: Boolean, default: false },
  mandantory : { type: Boolean, default: false },
})

</script>
