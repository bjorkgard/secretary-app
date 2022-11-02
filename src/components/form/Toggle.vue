<template>
  <SwitchGroup
    as="div"
    class="flex items-center"
  >
    <Switch
      v-model="value"
      :class="[value ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-600', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900']"
    >
      <span :class="[value ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-slate-900']">
        <span
          :class="[value ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
          aria-hidden="true"
        >
          <svg
            class="h-3 w-3 text-slate-400"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          :class="[value ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']"
          aria-hidden="true"
        >
          <svg
            class="h-3 w-3 text-sky-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
    <SwitchLabel
      as="span"
      class="ml-3"
    >
      <span class="text-sm font-medium text-slate-700 dark:text-slate-400">{{ label }}</span>
      <span class="text-sm text-slate-500 dark:text-slate-400">{{ description }}</span>
    </SwitchLabel>
  </SwitchGroup>
</template>

<script setup>
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { useField }                         from 'vee-validate'

const props = defineProps({
    label       : { type: String, required: true },
    modelValue  : { type: Boolean, default: false },
    description : { type: String, default: '' },
    name        : { type: String, required: true },
})

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})
</script>
