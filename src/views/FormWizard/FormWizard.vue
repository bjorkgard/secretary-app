<template>
  <form @submit="onSubmit">
    <Steps
      :steps="stepCounter"
      :current="currentStepIdx"
    />
    <slot />
    <div class="mt-4 flex justify-end">
      <SecondaryButton
        v-if="hasPrevious"
        label="Föregående"
        @click="goToPrev"
      />
      <Button
        :is-submitting="isSubmitting"
        :label="isLastStep ? 'Spara' : 'Nästa'"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useForm }                from 'vee-validate'
import Button                     from '@/components/form/Button.vue'
import SecondaryButton            from '@/components/form/SecondaryButton.vue'
import Steps                      from '@/components/Steps.vue'

const props = defineProps({
    validationSchema: {
        type     : Array,
        required : true,
    },
    formValues: {
        type     : Object,
        required : true,
    },
})

const emit           = defineEmits([ 'submit' ])
const currentStepIdx = ref(0)
const isSubmitting   = ref(false)

// Injects the starting step, child <form-steps> will use this to generate their ids
const stepCounter = ref(0)
provide('STEP_COUNTER', stepCounter)

// Inject the live ref of the current index to child components
// will be used to toggle each form-step visibility
provide('CURRENT_STEP_INDEX', currentStepIdx)

// if this is the last step
const isLastStep = computed(() => {
    return currentStepIdx.value === stepCounter.value - 1
})

// If the `previous` button should appear
const hasPrevious = computed(() => {
    return currentStepIdx.value > 0
})

// extracts the indivdual step schema
const currentSchema = computed(() => {
    return props.validationSchema[ currentStepIdx.value ]
})

const { values, handleSubmit } = useForm({
    initialValues       : props.formValues,
    // vee-validate will be aware of computed schema changes
    validationSchema    : currentSchema,
    // turn this on so each step values won't get removed when you move back or to the next step
    keepValuesOnUnmount : true,
})

// We are using the "submit" handler to progress to next steps
// and to submit the form if its the last step
const onSubmit = handleSubmit((values) => {
    if (!isLastStep.value) {
        currentStepIdx.value++

        return
    }

    isSubmitting.value = true

    // Let the parent know the form was filled across all steps
   emit('submit', values)
})

const goToPrev = () => {
    if (currentStepIdx.value === 0) {
        return
    }

    currentStepIdx.value--
}
</script>
