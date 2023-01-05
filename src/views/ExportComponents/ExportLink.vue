<template>
  <li class="p-3 text-sm hover:bg-sky-100">
    <Menu
      as="div"
      class="w-full h-full relative"
    >
      <MenuButton class="w-full h-full flex">
        <PaperClipIcon
          class="h-5 w-5 text-slate-500"
          aria-hidden="true"
        />
        <span class="font-medium text-slate-700 ml-2 truncate dark:text-slate-500">{{ object.name }}</span>
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="absolute left-10 z-10 -mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800">
          <div class="py-1">
            <MenuItem
              v-for="type in object.types"
              :key="type"
              v-slot="{ active }"
            >
              <button
                :class="[active ? 'bg-slate-100 dark:bg-slate-500 dark:text-slate-800' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left dark:text-slate-400']"
                @click="makeExport(type)"
              >
                {{ type }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </li>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ipcRenderer }                           from 'electron'
import { PaperClipIcon }                         from '@heroicons/vue/20/solid'

const props = defineProps({
    object: { type: Object, required: true },
})

const makeExport = (type) => {
    ipcRenderer.invoke(props.object.function, { type: type })
}

</script>
