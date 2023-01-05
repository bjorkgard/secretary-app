<template>
  <div>
    <h2 class="font-medium text-lg text-slate-500 dark:text-slate-400">
      Externa applikationer
    </h2>
  </div>
  <div class="mt-2 border-t border-slate-300 dark:border-slate-500">
    <dl class="divide-y divide-slate-300 dark:divide-slate-500">
      <div
        v-for="application in applications"
        :key="application.name"
        class="grid grid-cols-3 gap-4 py-2"
      >
        <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
          {{ application.name }}
        </dt>
        <dd class="flex text-sm text-slate-500 col-span-2 mt-0 dark:text-slate-500">
          <span class="flex-grow">{{ application.copyright }}</span>
          <span class="ml-4 flex-shrink-0">
            {{ application.version }}
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const applications = ref([])

onMounted(() => {
    applications.value.push(
        { },
    )
})

</script>
