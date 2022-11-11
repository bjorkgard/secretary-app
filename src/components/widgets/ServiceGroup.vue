<template>
  <div>
    <Widget
      footer
      header
    >
      <template #header>
        <BriefcaseIcon class="h-6 w-6 text-slate-500" /> <span>Tjänstegrupper</span> <div />
      </template>
      <template #body>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
          <li
            v-for="serviceGroup in serviceGroups"
            :key="serviceGroup._id"
            class="px-4 py-2 flex items-center space-x-2 group"
          >
            <span class="text-sm leading-5 font-medium text-slate-700 dark:text-slate-400">
              {{ serviceGroup.name }}
            </span>
            <div class="grow space-x-2 flex justify-center">
              <button
                type="button"
                class="flex-shrink-0 p-1 text-slate-400 focus:outline-none disabled:opacity-40"
                @click="editServiceGroup(serviceGroup._id)"
              >
                <PencilIcon
                  class="h-5 w-5 opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                class="flex-shrink-0 p-1 text-slate-400 focus:outline-none disabled:opacity-40"
                :disabled="serviceGroup.publishers_count > 0"
                @click="deleteServiceGroup(serviceGroup._id)"
              >
                <TrashIcon
                  class="h-5 w-5 opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </div>
            <span class="text-sm leading-5 text-slate-500 text-right">
              {{ `${serviceGroup.publishers_count || 0} förkunnare` }}
            </span>
          </li>
        </ul>
      </template>
      <template #footer>
        <button
          type="button"
          class="flex-shrink-0 p-1 text-slate-500 hover:text-sky-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
          title="Lägg till tjänstegrupp"
          tabindex="-1"
          @click="addServiceGroup"
        >
          <PlusIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </button>
      </template>
    </Widget>
    <Dialog
      :show="showForm"
      @close="hideForm"
    >
      <template #body>
        <form
          id="serviceGroupForm"
          class="w-full"
          @submit="onSubmit"
        >
          <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-slate-900">
              Tjänstegrupp
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Fyll i uppgifterna och tryck på Spara.
              </p>
              <div class="mt-2">
                <Input
                  id="sg_name"
                  label="Namn"
                  name="name"
                />
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <Button
          form="serviceGroupForm"
          :disabled="isSubmitting"
        />
        <SecondaryButton @click="hideForm" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref }          from 'vue'
import { ipcRenderer }             from 'electron'
import { BriefcaseIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { PencilIcon, TrashIcon }   from '@heroicons/vue/20/solid'
import { useForm }                 from 'vee-validate'
import { object, string }          from 'yup'
import log                         from 'electron-log'
import Widget                      from './Widget.vue'
import Dialog                      from '@/components/Dialog.vue'
import SecondaryButton             from '@/components/form/SecondaryButton.vue'
import Button                      from '@/components/form/Button.vue'
import Input                       from '@/components/form/Input.vue'

const showForm      = ref(false)
const serviceGroups = ref([])

const validationSchema = object({
    name: string().required('Obligatoriskt'),
})

const { handleSubmit, isSubmitting } = useForm({
    initialValues    : null,
    validationSchema : validationSchema,
})

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    await ipcRenderer.invoke('storeServiceGroup', values ).then((response) => {
        ipcRenderer.send('show-notification', { title: `Tjänstegrupp ${response.name} är tillagd`, body: null })
        hideForm()
        fetchServiceGroups()
    })
    resetForm()
})

const hideForm = () => {
    showForm.value = false
}

const addServiceGroup = () => {
    showForm.value = true
}

const editServiceGroup = (id) => {
    log.info(`Ändra tjänstegrupp ${id}`)
}

const deleteServiceGroup = (id) => {
    ipcRenderer.send('openConfirmation', {
        id               : id,
        message          : 'Är du säker på att du vill radera den här tjänstegruppen?',
        responseListener : 'confirmedDeletionServiceGroup',
    })
}

const fetchServiceGroups = () => {
    ipcRenderer.invoke('getServiceGroups', { publishers: true }).then((response) => {
        serviceGroups.value = response
    })
}

onMounted(() => {
    ipcRenderer.on('confirmedDeletionServiceGroup', (event, args) => {
        ipcRenderer.invoke('deleteServiceGroup', { id: args.id }).then(() => {
            //publishers.value = publishers.value.filter(item => item._id !== args.id)
            fetchServiceGroups()
        })

        ipcRenderer.send('show-notification', { title: 'Tjänstegruppen är raderad', body: null })
    })

    fetchServiceGroups()
})

</script>
