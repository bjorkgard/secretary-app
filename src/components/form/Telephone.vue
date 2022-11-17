<template>
  <PhoneInput
    ref="phoneInput"
    v-bind="attrs"
    :error-message="errorMessage"
    @input="validatePhone"
  />
</template>

<script>
import { onMounted, getCurrentInstance, ref, computed } from 'vue'
import { useField }                                     from 'vee-validate'
import PhoneInput                                       from '@/components/form/PhoneInput.vue'

export default {
    components: {
        PhoneInput,
    },
    emits: [ 'inputData' ],
    setup(props, context) {
        const that       = getCurrentInstance()
        const phoneInput = ref(null)

        const attrs = computed(() => {
            return context.attrs
        })

        const {
            value,
            errorMessage,
            handleChange,
            meta,
            setErrors,
        } = useField(context.attrs.name, context.attrs.rules, {
            initialValue          : context.attrs.value ? context.attrs.value : '',
            validateOnValueUpdate : true,
        })

        const validatePhone = (phoneObject) => {
            if(phoneObject.nationalNumber && !phoneObject.valid){
                setErrors('Felaktigt telefonnummer')
            }else{
                handleChange(phoneObject.nationalNumber, false)
            }

            context.emit('inputData', phoneObject)
        }

        onMounted(() => {
            if (context.attrs.value) {
                handleChange(context.attrs.value)
            }
            if (that.refs.phoneInput.phone) {
                handleChange(that.refs.phoneInput.phone)
            }
        })

        return {
            errorMessage,
            validatePhone,
            meta,
            phoneInput,
            attrs,
        }
    },
}

</script>
