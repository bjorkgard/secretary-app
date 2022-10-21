<template>
    <div class="w-screen h-screen flex flex-col">
        <header v-if="settings.identifier">
            <Header />
        </header>
        <main class="p-8 grow">
            <router-view v-slot="{Component}">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <footer class="min-w-full">
            <div class="mx-auto px-2 pt-1 pb-2 flex flex-col sm:flex-row border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-700">
                <div class="text-center text-sm text-slate-500 sm:text-left dark:text-slate-400">
                    ©{{ new Date().getFullYear() }} Secretary - All rights reserved.
                </div>
                <div class="sm:grow"></div>
                <div class="text-center text-sm text-slate-500 sm:text-right dark:text-slate-400">
                    {{version}}
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref }              from 'vue'
import { ipcRenderer }      from 'electron'
import { useSettingsStore } from '@/stores'
import Header               from '@/components/Header.vue'

const settings = useSettingsStore()

const version = ref(null)

ipcRenderer.send('app_version')
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.value = 'v ' + arg.version;
});
</script>
