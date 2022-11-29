<template>
  <nav class="h-full">
    <ul class="flex flex-col overflow-hidden space-y-2 mx-2 sm:mx-4 mt-2 h-full">
      <li class="hover:text-slate-200">
        <router-link
          to="/home"
          :class="[currentRoute.includes('home') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
        >
          <BuildingLibraryIcon
            :class="[currentRoute.includes('home') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
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
          :class="[currentRoute.includes('publishers') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
        >
          <UsersIcon
            :class="[currentRoute.includes('publishers') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
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
          :class="[currentRoute.includes('exports') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
        >
          <FolderArrowDownIcon
            :class="[currentRoute.includes('exports') ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300', 'flex-shrink-0 h-6 w-6']"
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
