<template>
  <nav class="bg-white shadow dark:bg-slate-800">
    <div class="mx-auto pr-4">
      <div class="flex h-14 justify-end">
        <div class="drag grow" />
        <div class="flex items-center space-x-1">
          <Menu
            v-if="warnings.warnings.length"
            as="div"
            class="relative inline-block text-left p-1"
          >
            <div>
              <MenuButton
                class="flex items-center rounded-full bg-transparent text-red-500 hover:text-red-600 focus:outline-none"
                title="Varningar"
              >
                <span class="sr-only">Show Warnings</span>
                <ExclamationTriangleIcon
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800">
                <div class="py-1">
                  <MenuItem
                    v-for="warning in warnings.warnings"
                    v-slot="{ active }"
                    :key="warning.id"
                  >
                    <span
                      :class="[active ? 'bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-400' : 'text-slate-700 dark:text-slate-600', 'block px-4 py-2 text-sm']"
                      @click="handle_warning_call(warning.type)"
                    >
                      {{ warning.label }}
                    </span>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
          <button
            type="button"
            class="flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-sky-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
            title="Inställningar"
            tabindex="-1"
            @click="showSettings"
          >
            <span class="sr-only">View Settings</span>
            <CogIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            class="flex-shrink-0 hidden rounded-full bg-white p-1 text-slate-400 hover:text-sky-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
            title="Notiser"
            tabindex="-1"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            class="flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-sky-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
            title="Avsluta"
            tabindex="-1"
            @click="abortApplication"
          >
            <span class="sr-only">Avsluta</span>
            <ArrowRightOnRectangleIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ipcRenderer }                                  from 'electron'
import { Menu, MenuButton, MenuItem, MenuItems }        from '@headlessui/vue'
import { BellIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { ExclamationTriangleIcon }                      from '@heroicons/vue/24/solid'
import { useWarningsStore }                             from '@/stores'
import router                                           from '@/router'

const warnings = useWarningsStore()

const handle_warning_call = (type) => {
    if(type === 'backup'){
        ipcRenderer.invoke('generate-backup')
    }

    warnings.remove(type)
}

const showSettings = () => {
    router.push({ name: 'settings' })
}

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
