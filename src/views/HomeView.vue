<template>
  <div>
    <h1 class="text-3xl font-bold leading-tight text-center">
      Secretary - Startsida
    </h1>
    <pre>
        {{ settings }}
    </pre>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores'

const settings = useSettingsStore()

</script>
