<template>
  <div class="min-h-full grid">
    <div
      v-if="!showRegistration"
      class="justify-self-center text-slate-900 dark:text-slate-300"
    >
      <h1 class="text-3xl font-bold leading-tight text-center">
        Välkommen till Secretary
      </h1>
      <p class="animate-pulse text-center">
        Laddar in data
      </p>
    </div>
    <Registration v-show="showRegistration" />
  </div>
</template>

<script setup>
import { ipcRenderer }      from 'electron'
import { onMounted, ref }   from 'vue'
import Registration         from '@/components/Registration.vue'
import router               from '@/router'
import { useSettingsStore } from '@/stores'

const settingsStore    = useSettingsStore()
const showRegistration = ref(false)
const settings         = ref(null)

const initializeData = async () => {
    settings.value = await ipcRenderer.invoke('getSettings')

    if (settings.value) {
        // TODO: Check if it is time to start reports
        // TODO: Check if any publisher need to update any applications
        // TODO: If congregation is online. Retrive data from server
        // TODO: ...
        settingsStore.set(settings.value)
        router.push({ name: 'home' })
    } else {
        showRegistration.value = true
    }
}

onMounted(() => initializeData())

</script>
