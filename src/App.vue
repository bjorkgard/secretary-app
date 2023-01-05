<template>
  <div class="w-full h-screen flex flex-col no-drag">
    <header v-if="currentRoute !== 'about'">
      <HeaderMenu />
    </header>
    <div class="grow flex overflow-hidden">
      <aside class="sm:w-min flex flex-col bg-white shadow overflow-y-auto dark:bg-slate-800">
        <NavigationMenu />
      </aside>
      <main class="p-8 grow overflow-y-auto">
        <router-view v-slot="{Component}">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <footer
      v-if="currentRoute !== 'about'"
      class="min-w-full no-drag"
    >
      <div class="mx-auto px-2 pt-1 pb-2 flex flex-col sm:flex-row border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-700">
        <div class="text-center text-sm text-slate-500 sm:text-left dark:text-slate-400">
          {{ new Date().getFullYear() }} Secretary
        </div>
        <div class="sm:grow text-center text-sm text-slate-500 dark:text-slate-400">
          {{ settings.congregation.name }}
        </div>
        <div class="text-center text-sm text-slate-500 sm:text-right dark:text-slate-400">
          {{ `${locale} | v${version}` }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref }                          from 'vue'
import { ipcRenderer }                            from 'electron'
import { defineRule, configure }                  from 'vee-validate'
import { required, email }                        from '@vee-validate/rules'
import { localize, loadLocaleFromURL, setLocale } from '@vee-validate/i18n'
import { useRoute }                               from 'vue-router'
import HeaderMenu                                 from '@/components/HeaderMenu.vue'
import NavigationMenu                             from '@/components/NavigationMenu.vue'
import router                                     from '@/router'
import { useSettingsStore }                       from '@/stores'

const settings = useSettingsStore()

const currentRoute = computed(() => {
    return useRoute().name
})

// define vee rules
defineRule('required', required)
defineRule('email', email)
defineRule('allowed_domain', (value) => {
    if (!value || !value.length) {
        return true
    }
    if(value.includes('jwpub.org')){
        return 'E-postdomänen är inte tillåten'
    }
    return true
})

const version = ref(null)
const locale  = ref(null)

configure({
    generateMessage: localize({
        sv: {
            names: {
                congregationName   : 'Församlingsnamn',
                congregationNumber : 'Församlingsnummer',
                firstName          : 'Förnamn',
                lastName           : 'Efternamn',
                email              : 'E-postadress',
            },
        },
    }),
})


ipcRenderer.invoke('version').then(value => {
    version.value = value
})
ipcRenderer.invoke('locale').then(value => {
    locale.value = value
    loadLocaleFromURL(`https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/${value}.json`)

    setLocale(value)
})
ipcRenderer.on('changeRouteTo', (event, path) => {
    router.push(path)
})

/*
window.addEventListener ( 'blur', ()=>{
    ipcRenderer.send('window-focus', false)
})

window.addEventListener ( 'focus', ()=>{
    ipcRenderer.send('window-focus', true)
})

// main tells us our previous blur/focus event happened with bgThrottling:
ipcRenderer.on("window-focus-throttling", (event, boolFocus) => {
    focus.value = boolFocus ? true : false
})
*/
</script>
