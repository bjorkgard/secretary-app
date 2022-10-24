<template>
  <router-link
    :to="`/${to}`"
    :class="[
      currentRoute === to ? 'border-sky-500 text-slate-900 dark:bg-slate-900 dark:text-white dark:border-transparent' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-transparent',
      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium dark:px-3 dark:py-2 dark:rounded-md'
    ]"
  >
    {{ name }}
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps ({
    name : { type: String, required: true },
    to   : { type: String, required: true },
})

const currentRoute = computed(() => {
    return useRoute().name
})
</script>
