<template>
  <div class="flex flex-col">
    <div class="border-b border-slate-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 class="text-lg font-medium leading-6 text-slate-900">
        Förkunnare
      </h3>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <label
          for="mobile-search-candidate"
          class="sr-only"
        >
          Filtrera
        </label>
        <label
          for="desktop-search-candidate"
          class="sr-only"
        >
          Filtrera
        </label>
        <div class="flex rounded-md shadow-sm">
          <div class="relative flex-grow focus-within:z-10">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                class="h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="mobile-search-candidate"
              type="text"
              name="mobile-search-candidate"
              class="block w-full rounded-none rounded-l-md border-slate-300 pl-10 focus:border-sky-500 focus:ring-sky-500 sm:hidden"
              placeholder="Filtrera"
            >
            <input
              id="desktop-search-candidate"
              type="text"
              name="desktop-search-candidate"
              class="hidden w-full rounded-none rounded-l-md border-slate-300 pl-10 focus:border-sky-500 focus:ring-sky-500 sm:block sm:text-sm"
              placeholder="Filtrera"
            >
          </div>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:z-10"
          >
            <BarsArrowUpIcon
              class="h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
            <span class="ml-2">Sortera</span>
            <ChevronDownIcon
              class="ml-2.5 -mr-1.5 h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center rounded-r-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            @click="addPublisher"
          >
            <span>Lägg till</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-8 flex flex-col">
      <div class="-my-2 ">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="shadow-sm ring-1 ring-black ring-opacity-5">
            <table
              class="min-w-full border-separate"
              style="border-spacing: 0"
            >
              <thead class="bg-slate-50">
                <tr class="divide-x divide-slate-200">
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-2 pl-3 pr-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter"
                  >
                    Namn
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-2 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Telefon
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-2 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Mobil
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-2 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    E-post
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-2 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Adress
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-2 pr-2 pl-3 backdrop-blur backdrop-filter"
                  >
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr
                  v-for="(publisher, publisherIdx) in publishers"
                  :key="publisher._id"
                  :class="[publisherIdx % 2 === 0 ? 'undefined' : 'bg-slate-50', 'divide-x divide-slate-200']"
                >
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap py-2 pl-3 pr-3 text-sm font-medium text-slate-900']">
                    {{ publisher.lastName }}, {{ publisher.firstName }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell']">
                    {{ publisher.phone }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell']">
                    {{ publisher.cell }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell']">
                    <span @click="sendEmail(publisher.email)">{{ publisher.email }}</span>
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell']">
                    <Address :address="publisher.address" />
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'relative whitespace-nowrap py-2 pr-3 pl-3 h-full text-right text-sm font-medium']">
                    <div class="w-full h-full flex justify-end text-slate-500">
                      <router-link
                        :to="{ name: 'publishers.edit', params: {id:publisher._id}}"
                        :title="`Ändra ${publisher.firstName} ${publisher.lastName}`"
                      >
                        <PencilIcon class="h-5 w-5" />
                      </router-link>
                      <ArrowDownOnSquareIcon class="h-5 w-5" />
                      <button @click="deletePublisher(publisher._id)">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref }     from 'vue'
import { ipcRenderer, shell } from 'electron'
import log                    from 'electron-log'
import router                 from '@/router'
import Address                from '@/components/Address.vue'
import {
    BarsArrowUpIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    ArrowDownOnSquareIcon,
    TrashIcon,
} from '@heroicons/vue/20/solid'
import { PublisherSchema } from '@/database/schemas'

const publishers = ref([])

const initializeData = async () => {
    getPublishers()
    ipcRenderer.on('confirmedDeletion', (event, args) => {
        ipcRenderer.invoke('deletePublisher', { id: args.id }).then(() => {
            publishers.value = publishers.value.filter(item => item._id !== args.id)
        })
    })
}

onMounted(() => initializeData())

const addPublisher = () => {
    router.push({ name: 'publishers.add' })
}

const getPublishers = async (sort = 'standard', filter = null) => {
    publishers.value = await ipcRenderer.invoke('getPublishers', { sort: sort, filter: filter })
}

const sendEmail = (email) => {
    shell.openExternal(`mailto:${email}?subject=`)
}

const deletePublisher = (id) => {
    ipcRenderer.send('openConfirmation', {
        id               : id,
        message          : 'Är du säker på att du vill radera den här förkunnaren?',
        responseListener : 'confirmedDeletion',
    })
}

</script>
