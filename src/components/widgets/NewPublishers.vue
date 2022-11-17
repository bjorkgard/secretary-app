<template>
  <Widget
    v-if="publishers.length"
    header
  >
    <template #header>
      <UsersIcon class="h-6 w-6 text-slate-500" /> <span>Förkunnare utan tjänstegrupp</span> <div />
    </template>
    <template #body>
      <ul class="divide-y divide-slate-200 dark:divide-slate-700">
        <li
          v-for="publisher in publishers"
          :key="publisher._id"
          class="px-4 py-2 flex space-x-2"
        >
          <span class="grow text-sm leading-5 font-medium text-slate-700 dark:text-slate-400">
            {{ publisher.lastName }} {{ publisher.firstName }}
          </span>
          <span class="text-sm leading-5 text-slate-500 text-right">
            {{ publisher.createdAt.toISOString().split("T")[0] }}
          </span>

          <router-link
            class="text-slate-400 focus:outline-none"
            :to="{ name: 'publishers.edit', params: {id:publisher._id}}"
            :title="`Ändra ${publisher.firstName} ${publisher.lastName}`"
          >
            <PencilIcon class="h-5 w-5" />
          </router-link>
        </li>
      </ul>
    </template>
  </Widget>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ipcRenderer }    from 'electron'
import { UsersIcon }      from '@heroicons/vue/24/solid'
import { PencilIcon }     from '@heroicons/vue/20/solid'
import Widget             from './Widget.vue'
import router             from '@/router'

const publishers = ref([])

const updatePublisher = (id) => {
    router.push()
}

const fetchNewPublishers = () => {
    ipcRenderer.invoke('getNewPublishers').then((response) => {
        publishers.value = response
    })
}

onMounted(() => {
    fetchNewPublishers()
})
</script>
