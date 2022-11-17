<template>
  <TransitionRoot
    as="template"
    :show="show"
  >
    <Dialog
      as="div"
      class="relative z-10"
      @close="closeDialog"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity dark:bg-opacity-40" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-slate-800">
              <div
                v-if="closable"
                class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block"
              >
                <button
                  type="button"
                  class="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-slate-800"
                  @click="closeDialog"
                >
                  <XMarkIcon
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div class="sm:flex sm:items-start w-full">
                <slot name="body" />
              </div>
              <div class="mt-5 sm:mt-4 flex flex-row-reverse">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon }                                            from '@heroicons/vue/24/outline'

const emit = defineEmits([ 'close' ])

const props = defineProps ({
    show     : { type: Boolean, default: false },
    closable : { type: Boolean, default: false },
})

const closeDialog = () => {
    if(props.closable){
        emit('close')
    }
}

</script>
