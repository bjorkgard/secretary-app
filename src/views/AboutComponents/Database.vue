<template>
  <div>
    <h2 class="font-medium text-lg text-slate-500 dark:text-slate-400">
      Databasstatistik
    </h2>
  </div>
  <div class="mt-2 border-t border-slate-300 dark:border-slate-500">
    <dl class="divide-y divide-slate-300 dark:divide-slate-500">
      <div
        v-for="database in databases"
        :key="database.name"
        class="grid grid-cols-3 gap-4 py-2"
      >
        <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
          {{ database.name }}
        </dt>
        <dd class="flex text-sm text-slate-500 col-span-2 mt-0 dark:text-slate-400">
          <span class="flex-grow">{{ database.count }} poster</span>
          <span class="ml-4 flex-shrink-0">
            {{ database.size }}
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ipcRenderer }    from 'electron'

const databases = ref([])

onMounted(async () => {
    const datesStat        = await ipcRenderer.invoke('statsDates')
    const settingsStat     = await ipcRenderer.invoke('statsSettings')
    const publisherStat    = await ipcRenderer.invoke('statsPublishers')
    const serviceGroupStat = await ipcRenderer.invoke('statsServiceGroups')

    let database = {
        name  : 'Dates',
        count : datesStat.count,
        size  : datesStat.size,
    }
    databases.value.push(database)

    database = {
        name  : 'Publishers',
        count : publisherStat.count,
        size  : publisherStat.size,
    }
    databases.value.push(database)

    database = {
        name  : 'Service groups',
        count : serviceGroupStat.count,
        size  : serviceGroupStat.size,
    }
    databases.value.push(database)

    database = {
        name  : 'Settings',
        count : settingsStat.count,
        size  : settingsStat.size,
    }
    databases.value.push(database)
})

</script>
