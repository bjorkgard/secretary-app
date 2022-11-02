<template>
  <div
    v-if="shouldShow"
    class="mt-4"
  >
    <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-slate-900 dark:border dark:border-slate-500">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
            {{ title }}
          </h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ subtitle }}
          </p>
        </div>
        <div class="mt-5 space-y-6 md:col-span-2 md:mt-0">
          <div class="grid grid-cols-6 gap-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

defineProps({
    title    : { type: String, required: true },
    subtitle : { type: String, required: true },
})

// This is a ref injected from FormWizard
// clones the step index to get the step's index and advances it by 1 for the next step
// meaning each step gets a index id starting from 1
const currentIdx = inject('STEP_COUNTER').value++
// Grabs the live ref to the current form active step
const formStepIdx = inject('CURRENT_STEP_INDEX')

// If this step should be shown
const shouldShow = computed(() => {
  return currentIdx === formStepIdx.value
})
</script>
