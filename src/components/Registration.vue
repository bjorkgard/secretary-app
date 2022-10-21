<template>
    <div id="registration" class="justify-self-center text-slate-900 dark:text-slate-300" @submit.prevent="validateForm">
        <h1 class="text-3xl font-bold leading-tight text-center">Välkommen till Secretary</h1>
        <p class="text-center">Första gången du startar applikationen behöver du fylla i lite data om församlingen.<br/>Denna information sparas enbart på din lokala dator.</p>

        <form class="space-y-6 pt-6 max-w-4xl" action="#" method="POST">
            <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-slate-900 dark:border dark:border-slate-500">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">Församlingsinformation</h3>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Denna information används enbart när du exporterar filer.</p>
                    </div>
                    <div class="mt-5 space-y-6 md:col-span-2 md:mt-0">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6">
                                <label for="congregation" class="block text-sm font-medium text-slate-700 dark:text-slate-400">Församlingsnamn</label>
                                <input type="text" name="congregation" id="congregation" v-model="form.congregation" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800" required autofocus />
                            </div>

                            <div class="col-span-6">
                                <label for="congregationNumber" class="block text-sm font-medium text-slate-700 dark:text-slate-400">Församlingsnummer</label>
                                <input type="text" name="congregationNumber" id="congregationNumber" v-model="form.congregationNumber" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-slate-900 dark:border dark:border-slate-500">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">Personlig information</h3>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Denna information kan vara synlig om du väljer att slå på online-funktionalitet.</p>
                    </div>
                    <div class="mt-5 space-y-6 md:col-span-2 md:mt-0">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6">
                                <label for="firstName" class="block text-sm font-medium text-slate-700 dark:text-slate-400">Förnamn</label>
                                <input type="text" name="firstName" id="firstName" v-model="form.firstname" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800" required />
                            </div>

                            <div class="col-span-6">
                                <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-400">Efternamn</label>
                                <input type="text" name="lastName" id="lastName" v-model="form.lastname" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800" required />
                            </div>

                            <div class="col-span-6">
                                <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-400">E-postadress</label>
                                <input type="email" name="email" id="email" v-model="form.email" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button @click="abortApplication" type="button" class="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm ring-offset-slate-100 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-700">Avsluta</button>
                <button type="submit" class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-slate-100 shadow-sm ring-offset-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-700">Spara</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ipcRenderer }      from 'electron'
import { ref }              from 'vue'
import { v4 as uuidv4 }     from 'uuid'
import router               from '@/router';
import { useSettingsStore } from '@/stores'

const settingsStore = useSettingsStore()
const form          = ref({
    congregation       : null,
    congregationNumber : null,
    firstname          : null,
    lastname           : null,
    email              : null,
})

const validateForm = async () => {
    //todo: validate form
    const settings = {
        identifier   : uuidv4(),
        congregation : {
            name   : form.value.congregation,
            number : form.value.congregationNumber,
        },
        user: {
            firstname : form.value.firstname,
            lastname  : form.value.lastname,
            email     : form.value.email,
        }
    }

   const settingsModel = await ipcRenderer.invoke('storeSettings', JSON.parse(JSON.stringify(settings)))
   settingsStore.set(settingsModel)

    router.push({name: 'home'})
}

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
