<template>
  <div class="flex flex-col">
    <div class="border-b border-slate-200 pb-5 sm:flex sm:items-center sm:justify-between dark:border-slate-500">
      <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-slate-400">
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
              v-model="searchQuery"
              type="text"
              name="mobile-search-candidate"
              class="block w-full rounded-none rounded-l-md border-slate-300 pl-10 sm:hidden placeholder-slate-500 text-slate-800 focus:outline-none dark:text-slate-300 dark:border-transparent dark:bg-slate-700 focus:placeholder-slate-400 dark:placeholder-slate-400 dark:focus:bg-slate-50 dark:focus:text-slate-900 dark:border-slate-400"
              placeholder="Filtrera"
              @keyup="filterPublishers()"
            >
            <input
              id="desktop-search-candidate"
              v-model="searchQuery"
              type="text"
              name="desktop-search-candidate"
              class="hidden w-full rounded-none rounded-l-md border-slate-300 pl-10 sm:block sm:text-sm placeholder-slate-500 text-slate-800 focus:outline-none dark:text-slate-300 dark:border-transparent dark:bg-slate-700 focus:placeholder-slate-400 dark:placeholder-slate-400 dark:focus:bg-slate-50 dark:focus:text-slate-900 dark:border-slate-400"
              placeholder="Filtrera"
              @keyup="filterPublishers()"
            >
          </div>
          <button
            type="button"
            class="relative -ml-px inline-flex items-center rounded-r-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none dark:bg-slate-700 dark:text-slate-400 dark:border-slate-400"
            @click="addPublisher"
          >
            <span>Lägg till</span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-col dark:border dark:border-slate-500">
      <div class="-my-2">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="shadow-sm ring-1 ring-black ring-opacity-5">
            <table
              class="min-w-full border-separate"
              style="border-spacing: 0"
            >
              <thead class="bg-slate-50 dark:bg-slate-800">
                <tr class="divide-x divide-slate-200 dark:divide-none">
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3 px-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Namn
                      <BarsArrowDownIcon
                        v-if="sort !== 'NAME_REV'"
                        :class="[
                          sort === 'NAME' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort(sort === 'NAME' ? 'NAME_REV' : 'NAME')"
                      />
                      <BarsArrowUpIcon
                        v-else
                        :class="[
                          sort === 'NAME_REV' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort('NAME')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Telefon
                      <BarsArrowDownIcon
                        v-if="sort !== 'PHONE_REV'"
                        :class="[
                          sort === 'PHONE' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort(sort === 'PHONE' ? 'PHONE_REV' : 'PHONE')"
                      />
                      <BarsArrowUpIcon
                        v-else
                        :class="[
                          sort === 'PHONE_REV' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort('PHONE')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter sm:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Mobil
                      <BarsArrowDownIcon
                        v-if="sort !== 'CELL_REV'"
                        :class="[
                          sort === 'CELL' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort(sort === 'CELL' ? 'CELL_REV' : 'CELL')"
                      />
                      <BarsArrowUpIcon
                        v-else
                        :class="[
                          sort === 'CELL_REV' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort('CELL')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter lg:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      E-post
                      <BarsArrowDownIcon
                        v-if="sort !== 'EMAIL_REV'"
                        :class="[
                          sort === 'EMAIL' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort(sort === 'EMAIL' ? 'EMAIL_REV' : 'EMAIL')"
                      />
                      <BarsArrowUpIcon
                        v-else
                        :class="[
                          sort === 'EMAIL_REV' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort('EMAIL')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter lg:table-cell dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <div class="w-full flex">
                      Adress
                      <BarsArrowDownIcon
                        v-if="sort !== 'ADDRESS_REV'"
                        :class="[
                          sort === 'ADDRESS' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort(sort === 'ADDRESS' ? 'ADDRESS_REV' : 'ADDRESS')"
                      />
                      <BarsArrowUpIcon
                        v-else
                        :class="[
                          sort === 'ADDRESS_REV' ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500',
                          'w-4 h-4 self-end ml-2 hover:text-slate-700 dark:hover:text-slate-200'
                        ]"
                        @click="changeSort('ADDRESS')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3 pr-2 pl-3 backdrop-blur backdrop-filter dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-600">
                <tr
                  v-for="(publisher, publisherIdx) in publishers"
                  :key="publisher.id"
                  :class="[publisherIdx % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-700', 'divide-x divide-slate-200 dark:divide-none']"
                >
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap py-2 pl-3 pr-3 text-sm font-medium text-slate-900 dark:text-slate-300 dark:border-transparent']">
                    {{ publisher.lastName }}, {{ publisher.firstName }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell dark:text-slate-300 dark:border-transparent']">
                    {{ publisher.phone ? publisher.phone.formatted : null }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell dark:text-slate-300 dark:border-transparent']">
                    {{ publisher.cell ? publisher.cell.formatted : null }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell dark:text-slate-300 dark:border-transparent']">
                    <span @click="sendEmail(publisher.email)">{{ publisher.email }}</span>
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell dark:text-slate-300 dark:border-transparent']">
                    <Address :address="{address1:publisher.address1, address2:publisher.address2, zip:publisher.zip, city:publisher.city}" />
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'relative whitespace-nowrap py-2 pr-3 pl-3 h-full text-right text-sm font-medium dark:border-transparent']">
                    <div class="w-full h-full flex justify-end text-slate-400 space-x-2 dark:text-slate-300">
                      <router-link
                        class="hover:text-sky-700 focus:outline-none dark:hover:text-slate-400"
                        :to="{ name: 'publishers.edit', params: {id:publisher.id}}"
                        :title="`Ändra ${publisher.firstName} ${publisher.lastName}`"
                      >
                        <PencilIcon class="h-5 w-5" />
                      </router-link>
                      <Menu
                        as="div"
                        class="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton
                            class="flex items-center hover:text-sky-700 focus:outline-none dark:hover:text-slate-400"
                            :title="`Ladda ner filer för ${publisher.firstName} ${publisher.lastName}`"
                          >
                            <span class="sr-only">Open exports</span>
                            <DocumentArrowDownIcon
                              class="h-5 w-5"
                              aria-hidden="true"
                            />
                          </MenuButton>
                        </div>
                        <transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <MenuItems class="absolute right-0 z-10 -mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800">
                            <div class="pb-1">
                              <MenuItem>
                                <span
                                  class="text-slate-700 block px-4 py-2 text-sm font-bold border-b border-slate-300 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-400"
                                >
                                  {{ publisher.firstName }} {{ publisher.lastName }}
                                </span>
                              </MenuItem>
                              <MenuItem v-slot="{ active }">
                                <span
                                  :class="[active ? 'bg-slate-50 text-slate-900 dark:bg-slate-500 dark:text-slate-800' : 'text-slate-700', 'block px-4 py-2 text-sm dark:text-slate-400']"
                                >
                                  Exportera registerkort
                                </span>
                              </MenuItem>
                              <MenuItem v-slot="{ active }">
                                <span
                                  :class="[active ? 'bg-slate-50 text-slate-900 dark:bg-slate-500 dark:text-slate-800' : 'text-slate-700', 'block px-4 py-2 text-sm dark:text-slate-400']"
                                  @click="exportPublisherData(publisher.id)"
                                >
                                  Exportera data
                                </span>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                      <button
                        class="hover:text-sky-700 focus:outline-none dark:hover:text-slate-400"
                        :title="`Radera ${publisher.firstName} ${publisher.lastName}`"
                        @click="deletePublisher(publisher.id)"
                      >
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
import { onBeforeUnmount, onMounted, ref }       from 'vue'
import { ipcRenderer, shell }                    from 'electron'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import router                                    from '@/router'
import Address                                   from '@/components/Address.vue'
import {
    BarsArrowUpIcon,
    BarsArrowDownIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/vue/20/solid'

const publishers     = ref([])
const sort           = ref('NAME')
const searchQuery    = ref('')
const typingInterval = ref(500)
const typingTimer    = ref('')

const initializeData = async () => {
    getPublishers()
    ipcRenderer.on('confirmedDeletion', (event, args) => {
        ipcRenderer.invoke('deletePublisher', { id: args.id }).then((resp) => {
            if(resp){
                publishers.value = publishers.value.filter(item => item.id !== args.id)
            }
        })

        ipcRenderer.send('show-notification', { title: 'Förkunnaren är raderad', body: null })
    })
}

onMounted(() => initializeData())

onBeforeUnmount(() => {
    ipcRenderer.removeAllListeners('confirmedDeletion')
})

const changeSort = (sortValue) => {
    sort.value = sortValue
    getPublishers()
}

const filterPublishers = () => {
    clearTimeout(typingTimer.value)
    typingTimer.value = setTimeout( getPublishers, typingInterval.value)
}

const addPublisher = () => {
    router.push({ name: 'publishers.add' })
}

const getPublishers = async () => {
    publishers.value = await ipcRenderer.invoke('getPublishers', { sort: sort.value, searchQuery: searchQuery.value })
}

const sendEmail = (email) => {
    shell.openExternal(`mailto:${email}?subject=`)
}

const exportPublisherData = async (id) => {
    let publisher = await ipcRenderer.invoke('getPublisher', { id: id })
    // rewrite data for export
    publisher.contactPerson = true // set as contactPerson.
    publisher.contact       = null // We do not know the new contactPerson's id
    publisher.address       = {
        address1 : publisher.address1,
        address2 : publisher.address2,
        zip      : publisher.zip,
        city     : publisher.city,
    }
    publisher.updatedAt     = new Date()

    delete publisher.id
    delete publisher.serviceGroup
    delete publisher.address1
    delete publisher.address2
    delete publisher.zip
    delete publisher.city

    ipcRenderer.invoke('exportData', {
        type : 'publisher',
        name : `${publisher.lastName}_${publisher.firstName}_${id}.json`,
        data : publisher,
    })
}

const deletePublisher = (id) => {
    ipcRenderer.send('openConfirmation', {
        id               : id,
        message          : 'Är du säker på att du vill radera den här förkunnaren?',
        responseListener : 'confirmedDeletion',
    })
}

</script>
