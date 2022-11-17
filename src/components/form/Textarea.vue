<template>
  <div>
    <label
      v-if="label"
      :for="id"
      :class="[errorMessage ? 'text-rose-500' : 'text-slate-700 dark:text-slate-400', 'block text-sm font-medium']"
    >
      {{ label }}<span v-if="required">*</span>
    </label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <textarea
        :id="id"
        ref="textarea"
        v-model="value"
        rows="5"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :required="required"
        :readonly="readonly"
        :class="[
          errorMessage
            ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500'
            : '',
          !errorMessage
            ? 'border-slate-300 hover:border-slate-400 focus:ring-sky-500 focus:border-sky-500 dark:border-slate-700'
            : '',
          'block w-full pr-10 sm:text-sm rounded-md dark:bg-slate-500 dark:hover:border-slate-400',
        ]"
        @input="updateValue"
      />
      <div
        v-if="errorMessage"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <ExclamationCircleIcon
          class="h-5 w-5 text-rose-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <p
      v-if="type !== 'hidden'"
      class="mt-2 mb-2 text-xs"
    >
      <span
        v-if="errorMessage"
        class="text-rose-600"
      >
        {{ errorMessage }}
      </span>
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref }        from 'vue'
import { useField }              from 'vee-validate'
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  id          : { type: String, required: true },
  label       : { type: String, default: null },
  name        : { type: String, required: true },
  placeholder : { type: String, default: null },
  type        : { type: String, default: 'text' },
  modelValue  : { type: String, default: '' },
  autofocus   : { type: Boolean, default: false },
  required    : { type: Boolean, default: false },
  readonly    : { type: Boolean, default: false },
})

const textarea = ref()

onMounted(() => {
  if (textarea.value?.hasAttribute('autofocus')) {
    textarea.value.focus()
  }
})

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})

</script>
