<template>
  <DisclosureButton
    as="span"
    :class="[
      currentRoute === to ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-slate-900 dark:text-white dark:border-transparent' : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-transparent',
      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
    ]"
    @click="changeRoute(to)"
  >
    {{ name }}
  </DisclosureButton>
</template>


<script setup>
import { computed }         from 'vue'
import { useRoute }         from 'vue-router'
import { DisclosureButton } from '@headlessui/vue'
import router               from '@/router';

defineProps ({
    name : { type: String, required: true },
    to   : { type: String, required: true }
})

const currentRoute = computed(() => {
    return useRoute().name
})

const changeRoute = (routeName) => {
    router.push({ name: routeName })
}
</script>
