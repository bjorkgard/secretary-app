<template>
  <Listbox
    v-model="value"
    as="div"
  >
    <ListboxLabel :class="[errorMessage ? 'text-rose-500' : 'text-slate-700 dark:text-slate-400', 'block text-sm font-medium']">
      {{ label }}
    </ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        class="flex justify-between bg-white relative w-full border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:bg-slate-500 dark:border-slate-700 dark:hover:border-slate-400"
      >
        <span class="block truncate">{{ value ? value.name : '&nbsp;' }}</span>

        <div
          v-if="value && clearable"
          class="self-center"
          @click.prevent="clearSelectedValue"
        >
          <XMarkIcon class="h-4 w-4 text-slate-400 hover:text-slate-500 cursor-pointer dark:text-slate-700" />
        </div>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon
            class="h-5 w-5 text-slate-400 dark:text-slate-800"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm dark:bg-slate-500"
        >
          <ListboxOption
            v-for="(option, index) in options"
            :key="index"
            v-slot="{ active, selected }"
            as="template"
            :value="option"
          >
            <li
              :class="[
                active ? 'text-white bg-sky-600 dark:bg-sky-800 dark:text-sky-400' : 'text-slate-900',
                'cursor-default select-none relative py-2 pl-3 pr-9',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                {{ option.name }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white dark:text-sky-400' : 'text-sky-600 dark:text-sky-800',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
    <p class="mt-2 mb-2 text-xs">
      <span
        v-if="errorMessage"
        class="text-rose-600"
      >
        {{ errorMessage }}
      </span>
    </p>
  </Listbox>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon }                             from '@heroicons/vue/24/solid'
import { useField }                                                            from 'vee-validate'

const props = defineProps({
    label      : { type: String, required: true },
    modelValue : { type: Object, default: null },
    options    : { type: Array, required: true },
    clearable  : { type: Boolean, default: false },
    name       : { type: String, required: true },
    id         : { type: String, required: true },
})

const clearSelectedValue = () => {
  value.value = null
}

//const value = ref(props.modelValue ? props.options.find((o) => o.value === props.modelValue.value) : null)
//const emits = defineEmits([ 'update:modelValue' ])

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})
</script>
