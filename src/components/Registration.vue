<template>
  <div
    id="registration"
    class="justify-self-center text-slate-900 dark:text-slate-300"
  >
    <h1 class="text-3xl font-bold leading-tight text-center">
      Välkommen till Secretary
    </h1>
    <p class="text-center">
      Första gången du startar applikationen behöver du fylla i lite data om församlingen.<br>Denna information sparas enbart på din lokala dator.
    </p>

    <form
      class="space-y-6 pt-6 max-w-4xl"
      @submit="onSubmit"
    >
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-slate-900 dark:border dark:border-slate-500">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
              Församlingsinformation
            </h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Denna information används enbart när du exporterar filer.
            </p>
          </div>
          <div class="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6">
                <Input
                  id="congregationName"
                  label="Församlingsnamn"
                  name="congregationName"
                />
              </div>

              <div class="col-span-6">
                <Input
                  id="congregationNumber"
                  label="Församlingsnummer"
                  name="congregationNumber"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 dark:bg-slate-900 dark:border dark:border-slate-500">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
              Personlig information
            </h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Denna information kan vara synlig om du väljer att slå på online-funktionalitet.
            </p>
          </div>
          <div class="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6">
                <Input
                  id="firstName"
                  label="Förnamn"
                  name="firstName"
                />
              </div>

              <div class="col-span-6">
                <Input
                  id="lastName"
                  label="Efternamn"
                  name="lastName"
                />
              </div>

              <div class="col-span-6">
                <Input
                  id="email"
                  label="E-postadress"
                  name="email"
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm ring-offset-slate-100 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-700"
          @click="abortApplication"
        >
          Avsluta
        </button>
        <button
          type="submit"
          class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-slate-100 shadow-sm ring-offset-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-700 :disabled:opacity-75 :disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
          Spara
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ipcRenderer }      from 'electron'
import { v4 as uuidv4 }     from 'uuid'
import { useForm }          from 'vee-validate'
import router               from '@/router'
import { useSettingsStore } from '@/stores'
import Input                from '@/components/form/Input.vue'

const initialFormValues = {
    congregationName   : '',
    congregationNumber : '',
    firstName          : '',
    lastName           : '',
    email              : '',
}

const validationSchema = {
    congregationName   : 'required',
    congregationNumber : 'required',
    firstName          : 'required',
    lastName           : 'required',
    email              : 'required|email|allowed_domain',
}

const settingsStore                  = useSettingsStore()
const { handleSubmit, isSubmitting } = useForm({
  initialValues    : initialFormValues,
  validationSchema : validationSchema,
})



function onInvalidSubmit({ values, errors, results }) {
  //console.log(values) // current form values
  //console.log(errors) // a map of field names and their first error message
  //console.log(results) // a detailed map of field names and their validation results
}

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    const settings = {
        identifier   : uuidv4(),
        congregation : {
            name   : values.congregationName,
            number : values.congregationNumber,
        },
        user: {
            firstname : values.firstName,
            lastname  : values.lastName,
            email     : values.email,
        },
    }

    const settingsModel = await ipcRenderer.invoke('storeSettings', JSON.parse(JSON.stringify(settings)))
    settingsStore.set(settingsModel)

    resetForm()
    router.push({ name: 'home' })
}, onInvalidSubmit)

const abortApplication = () => {
    ipcRenderer.invoke('quit')
}
</script>
