<template>
  <div class="flex flex-col">
    <PageHeader text="Uppgifter" />
    <div class="mt-3 flex flex-col dark:border dark:border-slate-500">
      <div class="-my-2">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="shadow-sm ring-1 ring-black ring-opacity-5">
            <table
              class="min-w-full border-separate"
              style="border-spacing: 0"
            >
              <thead class="bg-slate-50 dark:bg-slate-800">
                <tr class="divide-x divide-slate-200 dark:divide-none">
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3 px-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Uppgift
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Förkunnare
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Standard
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3 pr-2 pl-3 backdrop-blur backdrop-filter dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-600">
                <tr
                  v-for="(task, taskIdx) in tasks"
                  :key="task.id"
                  :class="[taskIdx % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-700', 'divide-x divide-slate-200 dark:divide-none']"
                >
                  <td :class="[taskIdx !== task.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap py-2 pl-3 pr-3 text-sm font-medium text-slate-900 dark:text-slate-300 dark:border-transparent']">
                    {{ task.name }}
                  </td>
                  <td :class="[taskIdx !== task.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell dark:text-slate-300 dark:border-transparent']">
                    {{ task.countPublishers }}
                  </td>
                  <td :class="[taskIdx !== task.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell dark:text-slate-300 dark:border-transparent']">
                    <CheckIcon
                      v-if="task.mandatory"
                      class="h-5 w-5 text-slate-400 dark:text-slate-300"
                    />
                  </td>
                  <td :class="[taskIdx !== task.length - 1 ? 'border-b border-slate-200' : '', 'relative whitespace-nowrap py-2 pr-3 pl-3 h-full text-right text-sm font-medium dark:border-transparent']">
                    <div class="w-full h-full flex justify-end text-slate-400 space-x-2 dark:text-slate-300">
                      <button
                        v-if="!task.mandatory && task.countPublishers === 0"
                        class="hover:text-sky-700 focus:outline-none dark:hover:text-slate-400"
                        :title="`Radera ${task.type}`"
                        @click="deleteTask(task.id)"
                      >
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ipcRenderer }                     from 'electron'
import { CheckIcon, TrashIcon }            from '@heroicons/vue/20/solid'
import PageHeader                          from '@/components/PageHeader'

const tasks = ref([])

const initializeData = async () => {
    getTasks()
    ipcRenderer.on('confirmedDeletion', (event, args) => {
        ipcRenderer.invoke('deleteTask', { id: args.id }).then((resp) => {
            if(resp){
                tasks.value = tasks.value.filter(item => item.id !== args.id)
            }
        })

        ipcRenderer.send('show-notification', { title: 'Uppgiften är raderad', body: null })
    })
}

onMounted(() => initializeData())

onBeforeUnmount(() => {
    ipcRenderer.removeAllListeners('confirmedDeletion')
})

const getTasks = async () => {
    ipcRenderer.invoke('getAllTasks', { countPublishers: true }).then((response) => {
        tasks.value = response
    })
}

const deleteTask = (id) => {
    ipcRenderer.send('openConfirmation', {
        id               : id,
        message          : 'Är du säker på att du vill radera den här uppgiften?',
        responseListener : 'confirmedDeletion',
    })
}

</script>
