<template>
  <nav class="bg-white shadow dark:bg-slate-800">
    <div class="mx-auto pr-4">
      <div class="flex h-14 justify-end">
        <div class="drag grow" />
        <div class="flex items-center">
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
  </nav>
</template>

<script setup>
import { ipcRenderer }                                  from 'electron'
import { BellIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
