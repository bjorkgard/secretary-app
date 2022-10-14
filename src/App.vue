<template>
    <div class="w-screen h-screen flex flex-col">
        <main class="p-8 grow">
            <router-view/>
        </main>
        <footer class="min-w-full">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row border-t border-slate-200 bg-slate-50">
                <div class="text-center text-sm text-slate-500 sm:text-left">
                    {{version}}
                </div>
                <div class="sm:grow"></div>
                <div class="text-center text-sm text-slate-500 sm:text-right">
                    ©{{ new Date().getFullYear() }} Secretary - All rights reserved.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref }         from 'vue'
import { ipcRenderer } from 'electron'

const version = ref(null)

ipcRenderer.send('app_version')
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.value = 'v ' + arg.version;
});
</script>
