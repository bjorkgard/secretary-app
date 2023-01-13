<template>
  <div class="flex flex-col">
    <PageHeader text="Inställningar" />
    <div class="p-0">
      <div class="py-3">
        <div>
          <div class="border-b border-slate-200 dark:border-slate-500">
            <nav class="-mb-px flex space-x-8">
              <router-link
                v-slot="{ href, isExactActive }"
                to="/settings"
              >
                <li :class="[isExactActive ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm list-none']">
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
                <li :class="[isExactActive ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm list-none']">
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
import PageHeader    from '@/components/PageHeader'

onMounted(() => {
    router.push({ path: '/settings' })
})

</script>
