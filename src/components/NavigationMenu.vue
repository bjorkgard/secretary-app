<template>
  <nav class="h-full">
    <ul class="flex flex-col overflow-hidden space-y-2 mx-2 sm:mx-4 mt-2 h-full">
      <li class="hover:text-slate-200">
        <router-link
          to="/home"
          :class="[currentRoute.includes('home') ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Startsidan"
        >
          <BuildingLibraryIcon
            :class="[currentRoute.includes('home') ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
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
          :class="[currentRoute.includes('publishers') ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Förkunnare"
        >
          <UsersIcon
            :class="[currentRoute.includes('publishers') ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
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
          :class="[currentRoute.includes('exports') ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
          title="Exportera"
        >
          <FolderArrowDownIcon
            :class="[currentRoute.includes('exports') ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
            aria-hidden="true"
          />
          <span class="hidden sm:block ml-3">
            Exportera
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
    BuildingLibraryIcon,
    FolderArrowDownIcon,
    UsersIcon,
} from '@heroicons/vue/24/solid'

const currentRoute = computed(() => {
    return useRoute().name
})
</script>
