<template>
  <div class="mt-4">
    <div class="space-y-6">
      <section aria-labelledby="congregation-settings">
        <form
          v-if="show"
          @submit="onSubmit"
        >
          <div class="shadow rounded-md overflow-hidden">
            <div class="bg-white py-6 px-4 sm:p-6 dark:bg-slate-900">
              <div>
                <h2
                  id="payment-details-heading"
                  class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400"
                >
                  Församlingen
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Allmän information för församlingen
                </p>
              </div>

              <div class="mt-6 grid grid-cols-4 gap-6">
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-name"
                    label="Namn"
                    name="name"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-number"
                    label="Församlingsnummer"
                    name="number"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-co"
                    label="C/O"
                    name="co"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-address"
                    label="Adress"
                    name="address"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-zip"
                    label="Postnummer"
                    name="zip"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-city"
                    label="Ort"
                    name="city"
                    required
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Telephone
                    id="congregation-phone"
                    label="Telefon"
                    name="phone"
                    :value="congregation ? congregation.phone:null"
                    :preferred-countries="['SE']"
                    :valid-characters-only="true"
                    @input-data="setPhoneObject"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-email"
                    label="E-postadress"
                    name="email"
                    type="email"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <Input
                    id="congregation-orgNo"
                    label="Organisationsnummer"
                    name="organizationNumber"
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

const phoneObject  = ref(null)
const congregation = ref(null)
const settings     = ref(null)
const show         = ref(false)

const initializeData = async () => {
    settings.value     = await ipcRenderer.invoke('getSettings')
    congregation.value = settings.value.congregation
}

onMounted(async () => {
    await initializeData()
    setValues({
        name               : congregation.value.name,
        number             : congregation.value.number,
        co                 : congregation.value.co,
        address            : congregation.value.address,
        zip                : congregation.value.zip,
        city               : congregation.value.city,
        phone              : congregation.value.phone,
        email              : congregation.value.email,
        organizationNumber : congregation.value.organizationNumber,
    })
    show.value = true
})

const schema = yup.object({
  name               : yup.string().required('Obligatorisk'),
  number             : yup.string().required('Obligatorisk'),
  co                 : yup.string().nullable(),
  address            : yup.string().required('Obligatorisk'),
  zip                : yup.string().required('Obligatorisk'),
  city               : yup.string().required('Obligatorisk'),
  phone              : yup.string().nullable(),
  email              : yup.string().email().nullable(),
  organizationNumber : yup.string().nullable(),
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
    settings.value.congregation = formData

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
