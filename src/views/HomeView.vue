<template>
  <div>
    <h1 class="text-3xl font-bold leading-tight text-center">
      Secretary - Startsida
    </h1>
    <pre>
        {{ congegation }}
    </pre>
  </div>
</template>

<script setup>
import { computed }         from 'vue'
import { useSettingsStore } from '@/stores'

const settings = useSettingsStore()

const congegation = computed(() => settings.congregation)

</script>
