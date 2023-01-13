<template>
  <div class="flex flex-col">
    <div class="border-b border-slate-200 pb-3 sm:flex sm:items-center sm:justify-between dark:border-slate-500">
      <h3 class="text-3xl font-bold tracking-tight leading-9 text-slate-900 dark:text-slate-400">
        Inställningar
      </h3>
    </div>
    <div class="p-0">
      <div class="py-3">
        <div>
          <div class="border-b border-slate-200">
            <nav class="-mb-px flex space-x-8">
              <router-link
                v-slot="{ href, isExactActive }"
                to="/settings"
              >
                <li :class="[isExactActive ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm list-none']">
                  <a
                    :href="href"
                    @click="navigate"
                  >
                    Församlingen
                  </a>
                </li>
              </router-link>
              <router-link
                v-slot="{ href, isExactActive }"
                to="/circuitOverseer"
              >
                <li :class="[isExactActive ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm list-none']">
                  <a
                    :href="href"
                    @click="navigate"
                  >
                    Kretstillsyningsmannen
                  </a>
                </li>
              </router-link>
            </nav>
          </div>
        </div>

        <router-view name="settings" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import router        from '@/router'

onMounted(() => {
    router.push({ path: '/settings' })
})

</script>
