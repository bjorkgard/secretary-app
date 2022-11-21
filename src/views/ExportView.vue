<template>
  <div class="flex flex-col">
    <div class="border-b border-slate-200 pb-5 sm:flex sm:items-center sm:justify-between dark:border-slate-500">
      <h3 class="text-lg font-medium leading-9 text-slate-900 dark:text-slate-400">
        Exportera
      </h3>
    </div>
    <div class="p-0">
      <dl class="sm:divide-y sm:divide-slate-200">
        <ExportContainer
          name="Förkunnare"
          :exports="publisherExports"
        />
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref }         from 'vue'
import ExportContainer from './ExportComponents/ExportContainer.vue'

const publisherExports = ref([
    { name: 'Adresslista (bokstavsordning)', type: 'XLSX', function: 'export-address-list-name' },
    { name: 'Adresslista (gruppordning)', type: 'XLSX', function: 'export-address-list-group' },
    { name: 'Namnlista', type: 'XLSX', function: 'export-name-list' },
])

</script>
