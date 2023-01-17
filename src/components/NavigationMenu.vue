<template>
  <nav>
    <ul
      v-if="currentRoute"
      class="flex flex-col overflow-hidden space-y-2 mx-2 sm:mx-4 mt-2 h-full"
    >
      <li class="hover:text-slate-200">
        <router-link
          to="/home"
          :class="[currentRoute.includes('home') ? 'bg-sky-100 text-sky-900 dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Startsidan"
        >
          <RectangleGroupIcon
            :class="[currentRoute.includes('home') ? 'text-sky-500 dark:text-slate-300' : 'text-slate-400 group-hover:text-sky-500 dark:text-slate-400 dark:group-hover:text-slate-300', 'flex-shrink-0 h-6 w-6']"
            aria-hidden="true"
          />
          <span class="hidden sm:block ml-3">
            Startsidan
          </span>
        </router-link>
      </li>
      <li class="hover:text-slate-200">
        <router-link
          to="/publishers"
          :class="[currentRoute.includes('publishers') ? 'bg-sky-100 text-sky-900 dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Förkunnare"
        >
          <UsersIcon
            :class="[currentRoute.includes('publishers') ? 'text-sky-500 dark:text-slate-300' : 'text-slate-400 group-hover:text-sky-500 dark:text-slate-400 dark:group-hover:text-slate-300', 'flex-shrink-0 h-6 w-6']"
            aria-hidden="true"
          />
          <span class="hidden sm:block ml-3">
            Förkunnare
          </span>
        </router-link>
      </li>
      <li class="hover:text-slate-200">
        <router-link
          to="/exports"
          :class="[currentRoute.includes('exports') ? 'bg-sky-100 text-sky-900 dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Exportera"
        >
          <FolderArrowDownIcon
            :class="[currentRoute.includes('exports') ? 'text-sky-500 dark:text-slate-300' : 'text-slate-400 group-hover:text-sky-500 dark:text-slate-400 dark:group-hover:text-slate-300', 'flex-shrink-0 h-6 w-6']"
            aria-hidden="true"
          />
          <span class="hidden sm:block ml-3">
            Exportera
          </span>
        </router-link>
      </li>
      <li class="hover:text-slate-200">
        <router-link
          to="/tasks"
          :class="[currentRoute.includes('tasks') ? 'bg-sky-100 text-sky-900 dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Uppgifter"
        >
          <Square3Stack3DIcon
            :class="[currentRoute.includes('tasks') ? 'text-sky-500 dark:text-slate-300' : 'text-slate-400 group-hover:text-sky-500 dark:text-slate-400 dark:group-hover:text-slate-300', 'flex-shrink-0 h-6 w-6']"
            aria-hidden="true"
          />
          <span class="hidden sm:block ml-3">
            Uppgifter
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
    FolderArrowDownIcon,
    RectangleGroupIcon,
    Square3Stack3DIcon,
    UsersIcon,
} from '@heroicons/vue/24/solid'

const currentRoute = computed(() => {
    return useRoute().name
})
</script>
