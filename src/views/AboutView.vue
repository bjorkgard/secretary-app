<template>
  <div>
    <div class="fixed inset-0 flex w-40 flex-col">
      <div class="flex min-h-0 flex-1 flex-col border-r border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-transparent">
        <div class="flex flex-1 flex-col overflow-y-auto pb-4">
          <nav class="mt-5 flex-1 space-y-1 bg-slate-100 dark:bg-slate-800 px-2">
            <span
              v-for="item in navigation"
              :key="item.name"
              :class="[
                item.target === selectedTarget.target ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
              @click="selectTarget(item)"
            >
              <component
                :is="item.icon"
                :class="[item.current ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-500', 'mr-3 flex-shrink-0 h-6 w-6']"
                aria-hidden="true"
              />
              {{ item.name }}
            </span>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-1 flex-col pl-40">
      <main class="flex-1">
        <div class="mx-auto max-w-7xl">
          <Secretary v-if="selectedTarget.target === 'about'" />
          <Database v-if="selectedTarget.target === 'db'" />
          <Applications v-if="selectedTarget.target === 'applications'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref }               from 'vue'
import {
    ArchiveBoxIcon,
    CircleStackIcon,
    InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import Secretary    from './AboutComponents/Secretary.vue'
import Database     from './AboutComponents/Database.vue'
import Applications from './AboutComponents/Applications.vue'

const navigation = [
  { name: 'Secretary', target: 'about', icon: InformationCircleIcon },
  { name: 'Databas', target: 'db', icon: CircleStackIcon },
  { name: 'Applikationer', target: 'applications', icon: ArchiveBoxIcon },
]

const selectedTarget = ref(navigation[ 0 ])

const selectTarget = (target) => {
    selectedTarget.value = target
}

</script>
