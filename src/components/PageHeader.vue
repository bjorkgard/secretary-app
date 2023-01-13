<template>
  <div class="border-b border-slate-200 pb-3 sm:flex sm:items-center sm:justify-between dark:border-slate-500">
    <h3 class="text-3xl font-bold tracking-tight leading-9 text-slate-900 dark:text-slate-400">
      {{ text }}
    </h3>
    <slot name="actions" />
  </div>
</template>

<script setup>
defineProps({
    text: {
      type     : String,
      required : true,
    },
})
</script>
