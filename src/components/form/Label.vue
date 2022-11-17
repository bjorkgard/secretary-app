<template>
  <label
    class="block text-sm font-medium text-slate-700 dark:text-slate-400"
  >
    {{ label }}
  </label>
</template>

<script setup>
defineProps({
    label: { type: String, required: true },
})
</script>
