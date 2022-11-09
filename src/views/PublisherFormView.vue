<template>
  <div class="flex justify-center ">
    <FormWizard
      ref="publisherForm"
      :validation-schema="validationSchema"
      :form-values="formValues"
      class="w-full md:max-w-4xl"
      @submit="onSubmit"
      @abort="onAbort"
    >
      <FormStep
        title="Personlig information"
        subtitle="Fyll i informationen och tryck på Nästa."
      >
        <Toggle
          label="S-290"
          name="s290"
          class="col-span-6 sm:col-span-3"
        />
        <Toggle
          label="Personuppgiftskort"
          name="registerCard"
          class="col-span-6 sm:col-span-3"
        />
        <Input
          id="firstName"
          label="Förnamn"
          name="firstName"
          class="col-span-6"
          :required="true"
          :autofocus="true"
        />
        <Input
          id="lastName"
          label="Efternamn"
          name="lastName"
          class="col-span-6"
          :required="true"
        />
        <Input
          id="birthday"
          label="Födelsedatum"
          name="birthday"
          type="date"
          class="col-span-6 md:col-span-3"
        />
        <div class="col-span-6 mt-2 sm:mt-0 sm:col-span-3 flex space-x-6 md:justify-end">
          <Radio
            label="Man"
            option="male"
            name="gender"
            class="self-end"
          />
          <Radio
            label="Kvinna"
            option="female"
            name="gender"
            class="self-end"
          />
        </div>
        <Input
          id="baptised"
          label="Dopdatum"
          name="baptised"
          type="date"
          class="col-span-4 md:col-span-2"
        />
        <Checkbox
          name="baptisedUnknown"
          label="Okänt"
          class="self-end"
        />
        <div class="col-span-6 mt-2 sm:mt-0 sm:col-span-3 flex space-x-6 md:justify-end">
          <Radio
            label="Andra fåren"
            option="other_sheep"
            name="hope"
            class="self-end"
          />
          <Radio
            label="Smord"
            option="anointed"
            name="hope"
            class="self-end"
          />
        </div>
      </FormStep>
      <FormStep
        title="Kontaktinformation"
        subtitle="Om förkunnaren är kontaktperson för familjen markerar du det och fyller i en adress annars väljer du familjens kontaktperson."
      >
        <Toggle
          label="Kontaktperson"
          name="contactPerson"
          class="col-span-6 sm:col-span-3"
          @click="toggleContactPerson"
        />
        <Select
          id="contactId"
          label="Välj kontaktperson"
          name="contactId"
          :options="compContacts"
          class="col-span-6 sm:col-span-3"
        />
        <div
          v-if="contactPerson"
          class="col-span-6 mt-2 grid grid-cols-6 gap-6 p-4 border border-slate-300 rounded-md"
        >
          <Input
            id="address1"
            label="Adress"
            name="address1"
            class="col-span-6"
          />
          <Input
            id="address2"
            label="Adress 2"
            name="address2"
            class="col-span-6"
          />
          <Input
            id="zip"
            label="Postnummer"
            name="zip"
            class="col-span-6 md:col-span-3"
          />
          <Input
            id="city"
            label="Ort"
            name="city"
            class="col-span-6 md:col-span-3"
          />
        </div>
        <Telephone
          id="phone"
          label="Telefon"
          name="phone"
          class="col-span-6 md:col-span-3"
          :preferred-countries="['SE']"
          :valid-characters-only="true"
          @input-data="setPhoneObject"
        />
        <Telephone
          id="cell"
          label="Mobiltelefon"
          name="cell"
          class="col-span-6 md:col-span-3"
          :preferred-countries="['SE']"
          :valid-characters-only="true"
          @input-data="setPhoneObject"
        />
        <Input
          id="email"
          label="E-postadress"
          name="email"
          class="col-span-6 md:col-span-3"
          type="email"
        />
      </FormStep>
      <FormStep
        title="Församlingsinformation"
        subtitle="Välj vilken tjänstegrupp förkunnaren skall tillhöra."
      >
        <Select
          id="serviceGroup"
          :options="compServiceGroups"
          label="Tjänstegrupp"
          name="serviceGroup"
          class="col-span-6 md:col-span-3"
        />
        <Select
          id="status"
          :options="status"
          label="Status"
          name="status"
          class="col-span-6 md:col-span-3"
        />
        <Textarea
          id="information"
          label="Övrig information"
          name="information"
          class="col-span-6"
        />
      </FormStep>
      <FormStep
        title="Kontaktperson vid nödsituation"
        subtitle="Någon man kan kontakta vid en eventuell nödsituation."
      >
        <Input
          id="emergencyName"
          label="Namn"
          name="emergencyName"
          class="col-span-6"
        />
        <Input
          id="emergencyPhone"
          label="Telefon"
          name="emergencyPhone"
          class="col-span-6 md:col-span-3"
          type="tel"
        />
        <Input
          id="emergencyEmail"
          label="E-postadress"
          name="emergencyEmail"
          class="col-span-6 md:col-span-3"
          type="email"
        />
      </FormStep>
      <FormStep
        v-if="contactPerson"
        title="Barn"
        subtitle="Om förkunnaren har barn som inte är förkunnare kan du lägga till dem här."
      >
        <FieldArray
          v-slot="{ fields, push, remove }"
          name="children"
        >
          <fieldset
            v-for="(field, idx) in fields"
            :key="field.key"
            class="col-span-6 border border-solid border-slate-400 p-4 grid grid-cols-6 gap-6"
          >
            <legend class="text-sm text-slate-400">
              Barn #{{ idx+1 }}
            </legend>
            <Input
              :id="`firstName_${idx}`"
              label="Förnamn"
              :name="`children[${idx}].firstName`"
              class="col-span-6 md:col-span-3"
            />
            <Input
              :id="`birthday_${idx}`"
              label="Födelsedatum"
              :name="`children[${idx}].birthday`"
              type="date"
              class="col-span-4 md:col-span-2"
            />
            <button
              type="button"
              class="col-span-1 place-self-end flex-shrink-0 rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              title="Ta bort"
              @click="remove(idx)"
            >
              <XMarkIcon
                class="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </fieldset>
          <SecondaryButton
            label="Lägg till ett barn"
            class="col-span-2 place-self-center"
            @click="push({ firstName: '', birthday: '' })"
          />
        </FieldArray>
      </FormStep>
    </FormWizard>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { ipcRenderer }              from 'electron'
import { FieldArray }               from 'vee-validate'
import * as yup                     from 'yup'
import log                          from 'electron-log'
import { XMarkIcon }                from '@heroicons/vue/24/outline'
import FormStep                     from './FormWizard/FormStep.vue'
import FormWizard                   from './FormWizard/FormWizard.vue'
import Checkbox                     from '@/components/form/Checkbox.vue'
import Input                        from '@/components/form/Input.vue'
import Radio                        from '@/components/form/Radio.vue'
import Select                       from '@/components/form/Select.vue'
import Textarea                     from '@/components/form/Textarea.vue'
import Toggle                       from '@/components/form/Toggle.vue'
import SecondaryButton              from '@/components/form/SecondaryButton.vue'
import Telephone                    from '@/components/form/Telephone.vue'
import router                       from '@/router'

const contactPerson = ref(false)
const contacts      = ref([])
const publisherForm = ref(null)
const serviceGroups = ref([])
const status        = ref([
    { value: 'active', name: 'Regelbunden' },
    { value: 'irregular', name: 'Oregelbunden' },
    { value: 'inactive', name: 'Overksam' },
])
const phoneObject   = ref(null)
const cellObject    = ref(null)

const compContacts = computed(() =>
    contacts.value.map((c) => {
        return { name: `${c.lastName}, ${c.firstName}`, value: c._id }
    }),
)

const compServiceGroups = computed(() => {
    let data = []
    serviceGroups.value.map((sg) => {
        data.push( { name: sg.name, value: sg.id })
    })
    return data
})

const initializeData = async () => {
    contacts.value      = await ipcRenderer.invoke('getContacts')
    serviceGroups.value = await ipcRenderer.invoke('getServiceGroups')
}

onMounted(() => initializeData())

const validationSchema = [
    yup.object({
        s290            : yup.boolean(),
        registerCard    : yup.boolean(),
        firstName       : yup.string().required('Obligatoriskt'),
        lastName        : yup.string().required('Obligatoriskt'),
        birthday        : yup.date().max(new Date(), 'Födelsedag måste vara tidigare än dagens datum').nullable().transform(v => (v instanceof Date && !isNaN(v) ? v : null)),
        gender          : yup.string().required().oneOf([ 'male', 'female' ]),
        baptised        : yup.date().min(yup.ref('birthday'), 'Dopdatum måste vara senare än födelsedag').nullable().transform(v => (v instanceof Date && !isNaN(v) ? v : null)),
        baptisedUnknown : yup.boolean().when('baptised', {
            is   : (baptised) => baptised,
            then : yup.boolean().oneOf([ false ], 'Kan inte vara okänt när datum är satt'),
        }),
        hope: yup.string().required().oneOf([ 'other_sheep', 'anointed' ]),
    }),
    yup.object({
        contactPerson : yup.boolean(),
        contactId     : yup.mixed().when('contactPerson', {
            is   : false,
            then : yup.mixed().required('Du behöver välja en kontaktperson eller göra den här förkunnaren till kontaktperson'),
        }),
        address1: yup.string().when('contactPerson', {
            is   : true,
            then : yup.string().required('Obligatorisk'),
        }),
        address2 : yup.string(),
        zip      : yup.string().when('contactPerson', {
            is   : true,
            then : yup.string().required('Obligatorisk'),
        }),
        city: yup.string().when('contactPerson', {
            is   : true,
            then : yup.string().required('Obligatorisk'),
        }),
        phone : yup.string().nullable(),
        cell  : yup.string().nullable(),
        email : yup.string().email(),
    }),
    yup.object({
        serviceGroup : yup.mixed().required('Obligatorisk'),
        status       : yup.mixed().required('Obligatorisk'),
        information  : yup.string(),
    }),
    yup.object({
        emergencyName  : yup.string(),
        emergencyPhone : yup.string(),
        emergencyEmail : yup.string().email(),
    }),
]

const formValues = {
    s290            : false,
    registerCard    : false,
    gender          : 'male',
    baptisedUnknown : false,
    hope            : 'other_sheep',
    contactPerson   : false,
    children        : [],
    status          : status.value[ 0 ],
    serviceGroup    : null,
}

const toggleContactPerson = () => {
    contactPerson.value = !contactPerson.value
}

const setPhoneObject = (object) => {
    if(object.valid){
        if(object.type === 'phone'){
            phoneObject.value = object
        }
        if(object.type === 'cell'){
            cellObject.value = object
        }
    }
}

/**
 * Only Called when the last step is submitted
 */
 const onSubmit = async (formData) => {
    formData.phone = null
    formData.cell  = null
    if(phoneObject.value){
        formData.phone = phoneObject.value
    }
    if(cellObject.value){
        formData.cell = cellObject.value
    }

    const publisherModel = await ipcRenderer.invoke('storePublisher', JSON.parse(JSON.stringify(formData)))

    ipcRenderer.send('show-notification', { title: 'Förkunnaren är sparad', body: `Du har sparat ${publisherModel.firstName} ${publisherModel.lastName}` })

    router.push({ name: 'publishers' })
}

const onAbort = () => {
    router.push({ name: 'publishers' })
}

</script>
