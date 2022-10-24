<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium text-slate-700 dark:text-slate-400"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="value"
      :name="name"
      class="block w-full rounded-md border border-slate-300 bg-white mt-1 py-2 px-3 leading-5 placeholder-slate-500 focus:border-sky-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm dark:border-transparent dark:bg-slate-700 dark:text-slate-300 dark:placeholder-slate-400 dark:focus:border-white dark:focus:bg-white dark:focus:text-slate-900 dark:focus:ring-white"
      :placeholder="placeholder"
      :type="type"
      :required="required"
    >
  </div>
</template>

<script>
import { useModelWrapper } from '@/utils/modelWrapper'

export default {
    props: {
        label       : { type: String, required: true },
        modelValue  : { type: [ String,Number ], default: '' },
        required    : { type: Boolean, default: false },
        type        : { type: String, default: 'text' },
        placeholder : { type: String, default: '' },
        name        : { type: String, required: true },
        id          : { type: String, required: true },
    },

    setup(props, { emit }) {
        return {
            value: useModelWrapper(props, emit, 'modelValue')
        }
    }
}



</script>
