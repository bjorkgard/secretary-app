<template>
  <Disclosure
    v-slot="{ open }"
    as="nav"
    class="bg-white shadow dark:bg-slate-800"
  >
    <div class="mx-auto pl-16 pr-4">
      <div class="flex h-14 justify-between">
        <div class="flex dark:items-center px-2 lg:px-0">
          <div
            v-if="settings.identifier"
            class="hidden lg:ml-6 lg:flex lg:space-x-6"
          >
            <NavigationLink
              name="Startsida"
              to="home"
              tabindex="-1"
            />
            <NavigationLink
              name="Förkunnare"
              to="publishers"
              tabindex="-1"
            />
          </div>
        </div>

        <div
          v-if="settings.identifier"
          class="flex items-center lg:hidden"
        >
          <!-- Mobile menu button -->
          <DisclosureButton
            tabindex="-1"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-white dark:focus:ring-offset-slate-800"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon
              v-if="!open"
              class="block h-6 w-6"
              aria-hidden="true"
            />
            <XMarkIcon
              v-else
              class="block h-6 w-6"
              aria-hidden="true"
            />
          </DisclosureButton>
        </div>
        <div class="hidden lg:ml-4 lg:flex lg:items-center">
          <button
            type="button"
            class="flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
            title="Inställningar"
            tabindex="-1"
          >
            <span class="sr-only">View settings</span>
            <CogIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            class="flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
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
            class="flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
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

    <DisclosurePanel class="lg:hidden">
      <div class="space-y-1 pt-2 pb-3 dark:px-2">
        <NavigationSmallLink
          name="Startsida"
          to="home"
        />
        <NavigationSmallLink
          name="Förkunnare"
          to="publishers"
        />
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { ipcRenderer }                                                        from 'electron'
import { Disclosure, DisclosureButton, DisclosurePanel }                      from '@headlessui/vue'
import { MagnifyingGlassIcon }                                                from '@heroicons/vue/20/solid'
import { Bars3Icon, BellIcon, CogIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import NavigationLink                                                         from './NavigationLink.vue'
import NavigationSmallLink                                                    from './NavigationSmallLink.vue'
import { useSettingsStore }                                                   from '@/stores'

const settings = useSettingsStore()

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
