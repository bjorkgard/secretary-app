<template>
  <div class="relative flex items-center">
    <div class="flex items-center h-5">
      <input
        v-model="value"
        :value="option"
        :name="name"
        type="radio"
        class="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 dark:bg-slate-500 dark:focus:ring-offset-slate-700"
      >
    </div>
    <div class="ml-2 text-sm">
      <label
        class="font-medium text-slate-700 dark:text-slate-400"
      >
        {{ label }}
      </label>
      <p
        v-if="description"
        class="text-xs text-slate-500 dark:text-slate-400"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
    label       : { type: String, required: true },
    modelValue  : { type: [ String, Number ], default: '' },
    name        : { type: String, required: true },
    option      : { type: String, required: true },
    description : { type: String, default: '' },
})

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})
</script>
