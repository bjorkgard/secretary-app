<template>
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
              class="flex-shrink-0 p-1 text-slate-500 hover:text-sky-500 focus:outline-none dark:text-slate-400 dark:hover:text-white"
              @click="editServiceGroup(serviceGroup._id)"
            >
              <PencilIcon
                class="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-500"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              class="flex-shrink-0 p-1 text-slate-500 hover:text-sky-500 focus:outline-none dark:text-slate-400 dark:hover:text-white disabled:opacity-40"
              :disabled="serviceGroup.publishers_count > 0"
              @click="deleteServiceGroup(serviceGroup._id)"
            >
              <TrashIcon
                class="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-500"
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
</template>

<script setup>
import { onMounted, ref }          from 'vue'
import { ipcRenderer }             from 'electron'
import { BriefcaseIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { PencilIcon, TrashIcon }   from '@heroicons/vue/20/solid'
import log                         from 'electron-log'
import Widget                      from './Widget.vue'

const serviceGroups = ref([])

const addServiceGroup = () => {
    log.info('Lägg till tjänstegrupp')
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
