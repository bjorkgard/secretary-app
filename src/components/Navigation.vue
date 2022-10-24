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
            />
            <NavigationLink
              name="Inställningar"
              to="settings"
            />
            <NavigationLink
              name="Om Secretary"
              to="about"
            />
          </div>
        </div>
        <div
          v-if="settings.identifier"
          class="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end"
        >
          <div class="w-full max-w-lg lg:max-w-xs">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  class="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                class="block w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-slate-500 focus:border-sky-500 focus:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm dark:border-transparent dark:bg-slate-700 dark:text-slate-300 dark:placeholder-slate-400 dark:focus:border-white dark:focus:bg-white dark:focus:text-slate-900 dark:focus:ring-white no-drag"
                placeholder="Sök"
                type="search"
              >
            </div>
          </div>
        </div>
        <div
          v-if="settings.identifier"
          class="flex items-center lg:hidden"
        >
          <!-- Mobile menu button -->
          <DisclosureButton class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-white dark:focus:ring-offset-slate-800">
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
          name="Inställningar"
          to="settings"
        />
        <NavigationSmallLink
          name="Om Secretary"
          to="about"
        />
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { ipcRenderer }                                               from 'electron'
import { Disclosure, DisclosureButton, DisclosurePanel }             from '@headlessui/vue'
import { MagnifyingGlassIcon }                                       from '@heroicons/vue/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import NavigationLink                                                from './NavigationLink.vue'
import NavigationSmallLink                                           from './NavigationSmallLink.vue'
import { useSettingsStore }                                          from '@/stores'

const settings = useSettingsStore()

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
