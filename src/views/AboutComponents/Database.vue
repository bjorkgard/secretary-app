<template>
  <div>
    <p class="mt-1 max-w-2xl text-sm text-slate-500">
      Storlek på databasen
    </p>
  </div>
  <div class="mt-5 border-t border-slate-300">
    <dl class="divide-y divide-slate-300">
      <div
        v-for="database in databases"
        :key="database.name"
        class="grid grid-cols-3 gap-4 py-2"
      >
        <dt class="text-sm font-medium text-slate-500">
          {{ database.name }}
        </dt>
        <dd class="flex text-sm text-slate-900 col-span-2 mt-0">
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
    const settingsStat = await ipcRenderer.invoke('statsSettings')

    // settings
    let settings = {
        name  : 'Settings',
        count : settingsStat.count,
        size  : settingsStat.size,
    }

    databases.value.push(settings)
})

</script>
