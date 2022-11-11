<template>
  <div>
    <label
      :for="id"
      :class="[errorMessage ? 'text-rose-500' : 'text-slate-700 dark:text-slate-400', 'block text-sm font-medium']"
    >
      {{ label }}<span v-if="required">*</span>
    </label>
    <input
      :id="id"
      ref="input"
      v-model="value"
      :name="name"
      :class="[
        errorMessage && meta.touched ? 'bg-rose-50 border-rose-300 placeholder-rose-500 text-rose-800 dark:text-rose-200 dark:border-rose-800 dark:bg-rose-300' : 'bg-white border-slate-300 placeholder-slate-500 text-slate-800 dark:text-slate-300 dark:border-transparent dark:bg-slate-700',
        'block w-full rounded-md border mt-1 py-2 px-3 leading-5 focus:border-sky-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm dark:placeholder-slate-400 dark:focus:border-white dark:focus:bg-white dark:focus:text-slate-900 dark:focus:ring-white'
      ]"
      :placeholder="placeholder"
      :type="type"
      :required="required"
      :readonly="readonly"
    >
    <p
      v-if="errorMessage && meta.touched"
      :id="`${name}-error`"
      class="mt-2 text-sm italic text-rose-700 dark:text-rose-300"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useField }       from 'vee-validate'

const input = ref()

const props = defineProps({
    label       : { type: String, required: true },
    modelValue  : { type: [ String, Number ], default: '' },
    type        : { type: String, default: 'text' },
    placeholder : { type: String, default: '' },
    name        : { type: String, required: true },
    id          : { type: String, required: true },
    autofocus   : { type: Boolean, default: false },
    required    : { type: Boolean, default: false },
    readonly    : { type: Boolean, default: false },
})

onMounted(() => {
  if (props.autofocus) {
    input.value.focus()
  }
})

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})

</script>
