import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        identifier   : '',
        congregation : {},
        user         : {},
    }),
    actions: {
        set(settings) {
            this.identifier   = settings.identifier
            this.congregation = settings.congregation
            this.user         = settings.user
        }
    },
    persist: {
        storage: sessionStorage,
    }
})
