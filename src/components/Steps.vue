<template>
  <nav
    aria-label="Progress"
    class="min-w-full"
  >
    <ol
      role="list"
      class="flex items-center justify-center"
    >
      <li
        v-for="(step, stepIdx) in steps"
        :key="step"
        :class="[stepIdx !== steps - 1 ? 'pr-8 sm:pr-20' : '', 'relative']"
      >
        <template v-if="stepIdx < current">
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="h-0.5 w-full bg-sky-600" />
          </div>
          <span
            class="relative flex h-8 w-8 items-center justify-center rounded-full bg-sky-600"
          >
            <CheckIcon
              class="h-5 w-5 text-white dark:text-slate-700"
              aria-hidden="true"
            />
          </span>
        </template>
        <template
          v-else-if="stepIdx === current"
        >
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="h-0.5 w-full bg-slate-200 dark:bg-slate-500" />
          </div>
          <span
            class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-600 bg-white dark:bg-slate-700"
            aria-current="step"
          >
            <span
              class="h-2.5 w-2.5 rounded-full bg-sky-600"
              aria-hidden="true"
            />
          </span>
        </template>
        <template v-else>
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="h-0.5 w-full bg-slate-200 dark:bg-slate-500" />
          </div>
          <span
            class="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white hover:border-slate-400 dark:bg-slate-700 dark:border-slate-500"
          >
            <span
              class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-slate-400"
              aria-hidden="true"
            />
          </span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
    steps   : { type: Number, required: true },
    current : { type: Number, required: true },
})
</script>
