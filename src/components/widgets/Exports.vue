<template>
  <div>
    <Widget
      v-if="exports.length"
      header
    >
      <template #header>
        <ArrowDownTrayIcon class="h-6 w-6 text-slate-500" /> <span>Vanligaste exporterna</span> <div />
      </template>
      <template #body>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
          <li
            v-for="e in exports"
            :key="e.id"
            class="px-4 py-2 flex items-center group space-x-4"
            @click="makeExport(e.function, e.type)"
          >
            <span
              class="grow text-sm leading-5 font-medium text-slate-700 dark:text-slate-400 overflow-hidden truncate"
              :title="e.name"
            >
              {{ e.name }}
            </span>
            <span class="text-sm leading-5 text-slate-500 text-right whitespace-nowrap">
              {{ e.type }}
            </span>
            <span class="text-sm leading-5 text-slate-500 text-right whitespace-nowrap">
              {{ e.updatedAt }}
            </span>
          </li>
        </ul>
      </template>
    </Widget>
  </div>
</template>

<script setup>
import { onMounted, ref }    from 'vue'
import { ipcRenderer }       from 'electron'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import Widget                from './Widget.vue'

const exports = ref([])

const makeExport = (call, type) => {
    ipcRenderer.invoke(call, { type: type })
}

const fetchPopularExports = (limit) => {
    ipcRenderer.invoke('getPopularExports', { limit: limit }).then((response) => {
        exports.value = response
    })
}

onMounted(() => {
    fetchPopularExports(5)
})

</script>
