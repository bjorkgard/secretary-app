<template>
  <div class="mt-4">
    <div class="space-y-6">
      <section aria-labelledby="circuitOverseer-settings">
        <form
          v-if="show"
          @submit="onSubmit"
        >
          <div class="shadow rounded-md overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6 dark:bg-slate-900">
              <div>
                <h2
                  id="circuitOverseer-settings-heading"
                  class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400"
                >
                  Kretstillsyningsmannen
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Kontaktuppgifter för kretstillsyningsmannen
                </p>
              </div>

              <div class="mt-6 grid grid-cols-4 gap-6">
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-firstname"
                    label="Förnamn"
                    name="firstName"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-lastname"
                    label="Efternamn"
                    name="lastName"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-address1"
                    label="Adress"
                    name="address1"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-address2"
                    label="Adress 2"
                    name="address2"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-zip"
                    label="Postnummer"
                    name="zip"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-city"
                    label="Ort"
                    name="city"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Telephone
                    id="circuitOverseer-phone"
                    label="Telefon"
                    name="phone"
                    :value="circuitOverseer ? circuitOverseer.phone:null"
                    :preferred-countries="['SE']"
                    :valid-characters-only="true"
                    @input-data="setPhoneObject"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="circuitOverseer-email"
                    label="E-postadress"
                    name="email"
                    type="email"
                  />
                </div>
              </div>
            </div>

            <div class="bg-slate-50 px-4 py-3 text-right sm:px-6 dark:bg-slate-900">
              <Button />
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ipcRenderer }    from 'electron'
import { useForm }        from 'vee-validate'
import * as yup           from 'yup'
import Button             from '@/components/form/Button.vue'
import Input              from '@/components/form/Input.vue'
import Telephone          from '@/components/form/Telephone.vue'
import log                from 'electron-log'

const phoneObject     = ref(null)
const circuitOverseer = ref(null)
const settings        = ref(null)
const show            = ref(false)

const initializeData = async () => {
    settings.value        = await ipcRenderer.invoke('getSettings')
    circuitOverseer.value = settings.value.circuitOverseer
}

onMounted(async () => {
    await initializeData()
    setValues({
        firstName : circuitOverseer.value.firstName,
        lastName  : circuitOverseer.value.lastName,
        address1  : circuitOverseer.value.address1,
        address2  : circuitOverseer.value.address2,
        zip       : circuitOverseer.value.zip,
        city      : circuitOverseer.value.city,
        phone     : circuitOverseer.value.phone,
        email     : circuitOverseer.value.email,
    })
    show.value = true
})

const schema = yup.object({
  firstName : yup.string().required('Obligatorisk'),
  lastName  : yup.string().required('Obligatorisk'),
  address1  : yup.string().nullable(),
  address2  : yup.string().nullable(),
  zip       : yup.string().nullable(),
  city      : yup.string().nullable(),
  phone     : yup.string().nullable(),
  email     : yup.string().email().nullable(),
})

const { handleSubmit, setValues } = useForm({
    validationSchema: schema,
})

const setPhoneObject = (object) => {
    if(object.valid){
        phoneObject.value = object
    }
}

const onSubmit = handleSubmit(async formData => {
    formData.phone = null

    if(phoneObject.value){
        formData.phone = phoneObject.value
    }
    settings.value.circuitOverseer = formData

    try{
        let settingsModel = null
        settingsModel     = await ipcRenderer.invoke('updateSettings', settings.value.id, JSON.parse(JSON.stringify(settings.value)))
        if(settingsModel){
            ipcRenderer.send('show-notification', { title: 'Inställningarna är uppdaterade' })
        }else{
            ipcRenderer.send('show-notification', { title: 'Okänt fel', body: 'Det gick inte att spara inställningarna.' })
        }
    }catch(err){
        log.error(err)
    }
})
</script>
