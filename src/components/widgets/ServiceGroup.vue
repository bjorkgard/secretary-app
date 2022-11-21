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
            <span class="text-sm leading-5 text-slate-500 text-right whitespace-nowrap">
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
          ref="serviceGroupForm"
          class="w-full"
          @submit="onSubmit"
        >
          <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
              Tjänstegrupp
            </h3>
            <div class="mt-2">
              <p class="text-sm text-slate-500">
                Fyll i uppgifterna och tryck på Spara.
              </p>
              <div class="mt-2">
                <Input
                  id="sg_id"
                  label=""
                  name="id"
                  type="hidden"
                />
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
import Widget                      from './Widget.vue'
import Dialog                      from '@/components/Dialog.vue'
import SecondaryButton             from '@/components/form/SecondaryButton.vue'
import Button                      from '@/components/form/Button.vue'
import Input                       from '@/components/form/Input.vue'

const showForm         = ref(false)
const serviceGroups    = ref([])
const formData         = ref(null)
const serviceGroupForm = ref(null)

const validationSchema = object({
    id   : string().nullable(),
    name : string().required('Obligatoriskt'),
})

const { handleSubmit, isSubmitting, setValues } = useForm({
    initialValues    : formData.value,
    validationSchema : validationSchema,
})

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    if(values.id) {
        await ipcRenderer.invoke('updateServiceGroup', values.id, values ).then((response) => {
            ipcRenderer.send('show-notification', { title: `Tjänstegrupp ${response.name} är uppdaterad`, body: null })
        })
    } else {
        await ipcRenderer.invoke('storeServiceGroup', values ).then((response) => {
            ipcRenderer.send('show-notification', { title: `Tjänstegrupp ${response.name} är tillagd`, body: null })
        })
    }

    fetchServiceGroups()
    hideForm()
    resetForm()
})

const hideForm = () => {
    setValues({
        name : '',
        id   : null,
    })
    showForm.value = false
}

const addServiceGroup = () => {
    setValues({
        name : '',
        id   : null,
    })
    showForm.value = true
}

const editServiceGroup = async (id) => {
    await ipcRenderer.invoke('getServiceGroup', { id: id }).then((response) => {
        setValues({
            name : response.name,
            id   : response.id,
        })
    })

    showForm.value = true
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
            fetchServiceGroups()
        })

        ipcRenderer.send('show-notification', { title: 'Tjänstegruppen är raderad', body: null })
    })

    fetchServiceGroups()
})

</script>
