<template>
  <div class="flex flex-col">
    <PageHeader text="Exportera" />
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
import PageHeader      from '@/components/PageHeader.vue'
import ExportContainer from './ExportComponents/ExportContainer.vue'

const publisherExports = ref([
    { name: 'Adresslista (bokstavsordning)', types: [ 'PDF', 'XLSX' ], function: 'export-address-list-name' },
    { name: 'Adresslista (gruppordning)', types: [ 'PDF', 'XLSX' ], function: 'export-address-list-group' },
    { name: 'Namnlista', types: [ 'PDF', 'XLSX' ], function: 'export-name-list' },
])

</script>
