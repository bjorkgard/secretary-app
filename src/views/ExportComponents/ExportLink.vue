<template>
  <li
    class="flex items-center justify-between py-3 pl-3 pr-4 text-sm hover:bg-sky-100"
    @click="makeExport()"
  >
    <div class="flex w-0 flex-1 items-center">
      <PaperClipIcon
        class="h-5 w-5 flex-shrink-0 text-slate-500"
        aria-hidden="true"
      />
      <span class="font-medium text-slate-700 ml-2 w-0 flex-1 truncate dark:text-slate-500">{{ object.name }}</span>
    </div>

    <div class="ml-4 flex-shrink-0">
      <span class="text-slate-500">
        {{ object.type }}
      </span>
    </div>
  </li>
</template>

<script setup>
import { ipcRenderer }   from 'electron'
import { PaperClipIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
    object: { type: Object, required: true },
})

const makeExport = () => {
    ipcRenderer.invoke(props.object.function)
}

</script>
