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
              class="block w-full rounded-none rounded-l-md border-slate-300 pl-10 focus:border-sky-500 focus:ring-sky-500 sm:hidden placeholder-slate-500 text-slate-800 dark:text-slate-300 dark:border-transparent dark:bg-slate-700 focus:placeholder-slate-400 dark:placeholder-slate-400 dark:focus:border-white dark:focus:bg-white dark:focus:text-slate-900 dark:focus:ring-white"
              placeholder="Filtrera"
              @keyup="filterPublishers()"
            >
            <input
              id="desktop-search-candidate"
              v-model="searchQuery"
              type="text"
              name="desktop-search-candidate"
              class="hidden w-full rounded-none rounded-l-md border-slate-300 pl-10 focus:border-sky-500 focus:ring-sky-500 sm:block sm:text-sm placeholder-slate-500 text-slate-800 dark:text-slate-300 dark:border-transparent dark:bg-slate-700 focus:placeholder-slate-400 dark:placeholder-slate-400 dark:focus:border-white dark:focus:bg-white dark:focus:text-slate-900 dark:focus:ring-white"
              placeholder="Filtrera"
              @keyup="filterPublishers()"
            >
          </div>
          <Menu
            as="div"
            class="relative"
          >
            <div>
              <MenuButton class="relative -ml-px inline-flex items-center border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:z-10">
                <BarsArrowUpIcon
                  class="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <span class="ml-2">Sortera</span>
                <ChevronDownIcon
                  class="ml-2.5 -mr-1.5 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('NAME')"
                  >
                    Namn
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('NAME_REV')"
                  >
                    Namn (omvänd)
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('EMAIL')"
                  >
                    E-postadress
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('EMAIL_REV')"
                  >
                    E-postadress (omvänd)
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('ADDRESS')"
                  >
                    Adress
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700 w-full text-left']"
                    @click="changeSort('ADDRESS_REV')"
                  >
                    Adress (omvänd)
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
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
                    class="sticky -top-8 z-10 flex border-b border-slate-300 bg-slate-50 bg-opacity-75 py-2 pl-3 pr-3 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter"
                  >
                    Namn
                    <BarsArrowDownIcon
                      v-if="sort === 'NAME'"
                      class="w-4 h-4 text-slate-400 self-end ml-2"
                      @click="changeSort('NAME_REV')"
                    />
                    <BarsArrowUpIcon
                      v-if="sort === 'NAME_REV'"
                      class="w-4 h-4 text-slate-400 self-end ml-2"
                      @click="changeSort('NAME')"
                    />
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
                    <div class="w-full flex">
                      E-post
                      <BarsArrowDownIcon
                        v-if="sort === 'EMAIL'"
                        class="w-4 h-4 text-slate-400 self-end ml-2"
                        @click="changeSort('EMAIL_REV')"
                      />
                      <BarsArrowUpIcon
                        v-if="sort === 'EMAIL_REV'"
                        class="w-4 h-4 text-slate-400 self-end ml-2"
                        @click="changeSort('EMAIL')"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    class="sticky -top-8 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-2 text-left text-sm font-bold text-slate-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    <div class="w-full flex">
                      Adress
                      <BarsArrowDownIcon
                        v-if="sort === 'ADDRESS'"
                        class="w-4 h-4 text-slate-400 self-end ml-2"
                        @click="changeSort('ADDRESS_REV')"
                      />
                      <BarsArrowUpIcon
                        v-if="sort === 'ADDRESS_REV'"
                        class="w-4 h-4 text-slate-400 self-end ml-2"
                        @click="changeSort('ADDRESS')"
                      />
                    </div>
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
                    {{ publisher.phone ? publisher.phone.formatted : null }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden sm:table-cell']">
                    {{ publisher.cell ? publisher.cell.formatted : null }}
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell']">
                    <span @click="sendEmail(publisher.email)">{{ publisher.email }}</span>
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'whitespace-nowrap px-2 py-2 text-sm text-slate-500 hidden lg:table-cell']">
                    <Address :address="publisher.address" />
                  </td>
                  <td :class="[publisherIdx !== publisher.length - 1 ? 'border-b border-slate-200' : '', 'relative whitespace-nowrap py-2 pr-3 pl-3 h-full text-right text-sm font-medium']">
                    <div class="w-full h-full flex justify-end text-slate-400 space-x-2">
                      <router-link
                        class="hover:text-sky-700"
                        :to="{ name: 'publishers.edit', params: {id:publisher._id}}"
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
                            class="flex items-center bg-white text-slate-400 hover:text-sky-700 focus:outline-none"
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
                          <MenuItems class="absolute right-0 z-10 -mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="pb-1">
                              <MenuItem>
                                <span
                                  class="text-slate-700 block px-4 py-2 text-sm font-bold border-b border-slate-300 bg-slate-100"
                                >
                                  {{ publisher.firstName }} {{ publisher.lastName }}
                                </span>
                              </MenuItem>
                              <MenuItem v-slot="{ active }">
                                <span
                                  :class="[active ? 'bg-slate-50 text-slate-900' : 'text-slate-700', 'block px-4 py-2 text-sm']"
                                >
                                  Exportera registerkort
                                </span>
                              </MenuItem>
                              <MenuItem v-slot="{ active }">
                                <span
                                  :class="[active ? 'bg-slate-50 text-slate-900' : 'text-slate-700', 'block px-4 py-2 text-sm']"
                                  @click="exportPublisherData(publisher._id)"
                                >
                                  Exportera data
                                </span>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                      <button
                        class="hover:text-sky-700"
                        :title="`Radera ${publisher.firstName} ${publisher.lastName}`"
                        @click="deletePublisher(publisher._id)"
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
import { onMounted, ref }                        from 'vue'
import { ipcRenderer, shell }                    from 'electron'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import router                                    from '@/router'
import Address                                   from '@/components/Address.vue'
import {
    BarsArrowUpIcon,
    BarsArrowDownIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    DocumentArrowDownIcon,
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
        ipcRenderer.invoke('deletePublisher', { id: args.id }).then(() => {
            publishers.value = publishers.value.filter(item => item._id !== args.id)
        })

        ipcRenderer.send('show-notification', { title: 'Förkunnaren är raderad', body: null })
    })
}

onMounted(() => initializeData())

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
    delete publisher._id

    publisher.updatedAt = new Date()

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
