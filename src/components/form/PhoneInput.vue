<template>
  <div>
    <label
      :for="name"
      :class="[errorMessage ? 'text-rose-500' : 'text-slate-700 dark:text-slate-400', 'block text-sm font-medium']"
    >
      {{ label }}<span v-if="required">*</span>
    </label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 flex items-center">
        <Listbox as="div">
          <ListboxButton
            :disabled="disabled"
            class="relative flex w-full cursor-default rounded-md bg-transparent py-2 pl-3 pr-8 text-left focus:outline-none sm:text-sm"
          >
            <span
              v-if="showFlags"
              :class="['vti__flag', activeCountryCode.toLowerCase()]"
            />
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                class="h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <transition
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 min-w-fit w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-slate-700 dark:border dark:border-slate-500">
              <ListboxOption
                v-for="(pb) in sortedCountries"
                :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
                v-slot="{ active }"
                tabindex="-1"
                @click="choose(pb)"
              >
                <li :class="[active ? 'bg-sky-100 dark:bg-slate-500 dark:text-slate-700':'','text-slate-900 relative cursor-default select-none py-1 pl-3 pr-9 flex justify-start items-center min-w-full dark:text-slate-400']">
                  <div class="flex mr-2">
                    <span
                      v-if="showFlags"
                      :class="['vti__flag', pb.iso2.toLowerCase()]"
                    />
                  </div>
                  <strong class="text-sm grow whitespace-nowrap">{{ pb.name }}</strong>
                  <span
                    v-if="showDialCodeInList"
                    class="text-right"
                  > +{{ pb.dialCode }} </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>
      </div>
      <input
        :id="id"
        ref="input"
        v-model="phone"
        :type="type"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :disabled="disabled"
        :maxlength="maxlength"
        :name="name"
        :placeholder="parsedPlaceholder"
        :readonly="readonly"
        :required="required"
        :tabindex="tabindexInput"
        :class="[
          errorMessage && meta.touched ? 'bg-rose-50 border-rose-300 placeholder-rose-500 text-rose-800 dark:text-rose-200 dark:border-rose-800 dark:bg-rose-300' : 'bg-white border-slate-300 placeholder-slate-500 text-slate-800 dark:text-slate-300 dark:border-transparent dark:bg-slate-700',
          'block w-full rounded-md border pl-16 mt-1 py-2 px-3 leading-5 focus:border-sky-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm dark:placeholder-slate-400 dark:focus:border-slate-400 dark:focus:bg-slate-400 dark:focus:text-slate-900 dark:focus:ring-transparent'
        ]"

        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
        @keyup.enter="onEnter"
        @keyup.space="onSpace"
      >
    </div>
    <p
      v-if="errorMessage"
      :id="`${name}-error`"
      class="mt-2 text-sm italic text-rose-700 dark:text-rose-300"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch }             from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { useField }                                              from 'vee-validate'
import { parsePhoneNumberFromString }                            from 'libphonenumber-js'
import { ChevronUpDownIcon }                                     from '@heroicons/vue/20/solid'
import log                                                       from 'electron-log'
import allCountries                                              from '@/utils/allCountries'
import getCountry                                                from '@/utils/getCountry'

const emit = defineEmits([
    'blur',
    'countryChanged',
    'enter',
    'focus',
    'input',
    'space',
    'validate',
])

/**
 * PROPS
 */
const props = defineProps({
    value: {
        type    : [ String, Object ],
        default : '',
    },
    allCountries: {
        type        : Array,
        default     : () => allCountries,
        description : 'All countries that are used in <code>libphonenumber-js</code>, can be overridden by this prop',
    },
    autoFormat: {
        type        : Boolean,
        default     : true,
        description : 'Auto update the input to the formatted phone number when it\'s valid',
    },
    customValidate: {
        type        : [ Boolean, RegExp ],
        default     : false,
        description : 'Custom validation RegExp for input',
    },
    defaultCountry: {
        type        : String,
        default     : '',
        description : 'Default country, will override the country fetched from IP address of user',
    },
    disabled: {
        type        : Boolean,
        default     : false,
        description : 'Disable <code>phone-input</code>, including the input & flag dropdown',
    },
    autoDefaultCountry: {
        type        : Boolean,
        default     : true,
        description : 'To fetch default country based on IP address of user',
    },
    showDialCodeInList: {
        type        : Boolean,
        default     : true,
        description : 'Show dial code in the dropdown list',
    },
    showDialCode: {
        type        : Boolean,
        default     : false,
        description : 'Show dial code in the input field',
    },
    showFlags: {
        type        : Boolean,
        default     : true,
        description : 'Show flags in the dropdown selection and list',
    },
    tabindexDropdown: {
        type        : Number,
        default     : 0,
        description : 'Native dropdown <code>tabindex</code> attribute',
    },
    ignoredCountries: {
        type        : Array,
        default     : () => [],
        description : 'List of countries will NOT be shown on the dropdown',
    },
    autocomplete: {
        type        : String,
        default     : 'on',
        description : 'Native input <code>autocomplete</code> attribute',
    },
    autofocus: {
        type        : Boolean,
        default     : false,
        description : 'Native input <code>autofocus</code> attribute',
    },
    id: {
        type        : String,
        default     : '',
        description : 'Native input <code>id</code> attribute',
    },
    maxlength: {
        type        : Number,
        default     : 25,
        description : 'Native input <code>maxlength</code> attribute',
    },
    name: {
        type        : String,
        default     : 'telephone',
        description : 'Native input <code>name</code> attribute',
    },
    placeholder: {
        type        : String,
        default     : '',
        description : 'Native input <code>placeholder</code> attribute',
    },
    readonly: {
        type        : Boolean,
        default     : false,
        description : 'Native input <code>readonly</code> attribute',
    },
    required: {
        type        : Boolean,
        default     : false,
        description : 'Native input <code>required</code> attribute',
    },
    tabindexInput: {
        type        : Number,
        default     : 0,
        description : 'Native input <code>tabindex</code> attribute',
    },
    type: {
        type        : String,
        default     : 'tel',
        description : 'Native input <code>type</code> attribute',
    },
    errorMessage: {
        type    : String,
        default : '',
    },
    mode: {
        type        : String,
        default     : 'auto',
        description : 'Allowed values: <code>\'auto\'</code> (Default set by phone),  <code>\'international\'</code> (Format number with the dial code i.e. + 61), <code>\'national\'</code> (Format number without dial code i.e. 0321232)',
        options     : [ 'auto', 'national', 'international' ],
    },
    onlyCountries: {
        type        : Array,
        default     : () => [],
        description : 'List of countries will be shown on the dropdown',
    },
    preferredCountries: {
        type        : Array,
        default     : () => [],
        description : 'Preferred countries list, will be on top of the dropdown',
    },
    validCharactersOnly: {
        type        : Boolean,
        default     : false,
        description : 'Only allow valid characters in a phone number (will also verify in <code>mounted</code>, so phone number with invalid characters will be shown as an empty string)',
    },
    label: {
        type     : String,
        required : true,
    },
})

/**
 * REFS
 */
const input             = ref(null)
const phone             = ref('')
const activeCountryCode = ref('')
const finishMounted     = ref(false)
const parsedPlaceholder = ref(props.placeholder)


/**
 * COMPUTED PROPERTIES
 */
const activeCountry = computed(() => {
    return findCountry(activeCountryCode.value)
})

const filteredCountries = computed(() => {
    // List countries after filtered
    if(props.onlyCountries.length) {
        return allCountries.filter(
            ({ iso2 }) => props.onlyCountries.some((c) => c.toUpperCase() === iso2),
        )
    }

    if(props.ignoredCountries.length) {
        return allCountries.filter(
            ({ iso2 }) => !props.ignoredCountries.includes(iso2.toUpperCase())
                && !props.ignoredCountries.includes(iso2.toLowerCase()),
        )
    }

    return allCountries
})

const parsedMode = computed(() => {
    if(props.mode === 'auto') {
        if(phone.value || phone.value.values[ 0 ] !== '+'){
            return 'national'
        }
        return 'international'
    }
    if(![ 'international','national' ].includes(props.mode)) {
        log.error('Invalid value of prop "mode"')
        return 'international'
    }

    return mode.value
})

const phoneObject = computed(() => {
    let result
    if (phone.value[ 0 ] === '+') {
        result = parsePhoneNumberFromString(phone.value) || {}
    } else {
        result = parsePhoneNumberFromString(phone.value, activeCountryCode.value) || {}
    }
    const {
        metadata,
        ...phoneObject
    } = result

    let valid     = result.isValid?.()
    let formatted = phone.value

    if(valid) {
        formatted = result.format?.(parsedMode.value.toUpperCase())
    }

    if(result.country && (props.ignoredCountries.length || props.onlyCountries.length)) {
        if(!findCountry(result.country)){
            valid = false
            Object.assign(result, { country: null })
        }
    }

    Object.assign(phoneObject, {
        countryCode : result.country,
        valid       : valid,
        //country     : activeCountry.value,
        formatted   : formatted,
        type        : props.name,
    })

    return phoneObject
})

const sortedCountries = computed(() => {
    // Sort the list countries: from preferred countries to all countries
    const preferredCountries = getCountries(props.preferredCountries)
        .map((country) => ({ ...country, preferred: true }))

    return [ ...preferredCountries, ...filteredCountries.value ]
})



/**
 * FUNCTIONS
 */
const cleanInvalidCharacters = () => {
    const currentPhone = phone.value

    if(props.validCharactersOnly){
        const results = phone.value.match(/[()\-+0-9\s]*/g)
        phone.value   = results.join('')
    }

    if (props.customValidate && props.customValidate instanceof RegExp) {
        const results = phone.value.match(props.customValidate)
        phone.value   = results.join('')
    }

    if (currentPhone !== phone.value) {
        emitInput(phone.value)
    }
}

const choose = (country) => {
    let parsedCountry = country
    if (typeof parsedCountry === 'string') {
        parsedCountry = findCountry(parsedCountry)
    }

    if (!parsedCountry) {
        return
    }

    if (phone.value[ 0 ] === '+' && parsedCountry.iso2 && phoneObject.value.nationalNumber) {
        activeCountryCode.value = parsedCountry.iso2
        // Attach the current phone number with the newly selected country
        phone.value = parsePhoneNumberFromString( phoneObject.value.nationalNumber, parsedCountry.iso2).formatInternational()

        return
    }

    if (props.showDialCode && parsedCountry) {
        // Reset phone if the showDialCode is set
        phone.value = `+${parsedCountry.dialCode}`
        return
    }

    // update value, even if international mode is NOT used
    activeCountryCode.value = parsedCountry.iso2
    emitInput(phone.value)
}

const emitInput = (value) => {
    emit('input', phoneObject.value, value )
}

const findCountry = (iso = '') => {
    return filteredCountries.value.find((country) => country.iso2 === iso.toUpperCase())
}

const getCountries = (list = []) => {
    return list.map((countryCode) => findCountry(countryCode)).filter(Boolean)
}

const initializeCountry = () => {
    return new Promise((resolve) => {
        /**
         * 1. If the phone included prefix (i.e. +12), try to get the country and set it
         */
        if (phone.value[ 0 ] === '+') {
            resolve()
            return
        }

        /**
         * 2. Use default country if passed from parent
         */
        if (props.defaultCountry) {
            choose(props.defaultCountry)
            resolve()
            return
        }

        /**
         * 3. Check if fetching country based on user's IP is allowed, set it as the default country
         */
        const fallbackCountry = props.preferredCountries[ 0 ] || filteredCountries.value[ 0 ]
        if (props.autoDefaultCountry) {
            getCountry()
                .then((res) => {
                    choose(res || activeCountryCode.value)
                })
                .catch((error) => {
                    log.warn(error)
                    /**
                     * 4. Use the first country from preferred list (if available) or all countries list
                     */
                    choose(fallbackCountry)
                })
                .then(() => {
                    resolve()
                })
        } else {
            /**
             * 4. Use the first country from preferred list (if available) or all countries list
             */
            choose(fallbackCountry)
            resolve()
        }
    })
}

const onBlur = () => {
    emit('blur')
}

const onEnter = () => {
    emit('enter')
}

const onFocus = () => {
    emit('focus')
}

const onSpace = () => {
    emit('space')
}

const onInput = () => {
    input.value.setCustomValidity(phoneObject.value.valid ? '' : props.errorMessage)

    // Returns response.number to assign it to v-model (if being used)
    // Returns full response for cases @input is used
    // and parent wants to return the whole response.
    emitInput(phone.value)
}

const resetPlaceholder = () => {
    parsedPlaceholder.value = props.placeholder
}

const testCharacters = () => {
    if(props.validCharactersOnly){
        const result = /^[()\-+0-9\s]*$/.test(phone.value)
        if (!result) {
            return false
        }
    }

    if (props.customValidate) {
        return testCustomValidate()
    }

    return true
}

const testCustomValidate = () => {
    return props.customValidate instanceof RegExp ? props.customValidate.test(phone.value) : false
}


/**
 * WATCH
 */
watch(activeCountry, (value, oldValue) => {
    if(!value && oldValue.iso2){
        activeCountryCode.value = oldValue.iso2
        return
    }
    if(value.iso2){
        emit('countryChanged', value)
    }
})

watch(
    () => phoneObject.value.countryCode,
    (value) => {
        activeCountryCode.value = value
    },
)

watch(
    () => phoneObject.value.valid,
    () => {
        emit('validate', phoneObject.value)
    },
)

watch(
    () => phoneObject.value.formatted,
    (value) => {
        if (!props.autoFormat || props.customValidate) {
            return
        }
        emitInput(value)

        nextTick(() => {
            // In case `v-model` is not set, we need to update the `phone` to be new formatted value
            if (value && !props.value) {
                phone.value = value
            }
        })
    },
)

watch(
    () => props.placeholder,
    () => {
        resetPlaceholder()
    },
)

watch(
    () => props.value,
    (value, oldVaöue) => {
        if (!testCharacters()) {
            nextTick(() => {
                phone.value = oldValue
                onInput()
            })
        } else {
            phone.value = value
        }
    },
)

const { value, errorMessage, meta } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
})


/**
 * ONMOUNTED
 */
onMounted(() => {
    if(props.value){
        if(typeof props.value === 'string'){
            phone.value = props.value.trim()
        }else{
            activeCountryCode.value = props.value.countryCode
            phone.value             = parsePhoneNumberFromString( props.value.number, props.value.countryCode).formatNational()
        }
    }

    cleanInvalidCharacters()

    initializeCountry()
        .then(() => {
            if(!props.value && props.showDialCode && activeCountryCode.value){
                phone.value = `+${activeCountryCode.value}`
            }
            emit('validate', phoneObject.value)
        })
        .catch((error) => {
            log.error(error)
        })
        .then(() => {
            finishMounted.value = true
        })
})
</script>
