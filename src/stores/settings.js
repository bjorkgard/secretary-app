import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        congregation : {},
        user         : {},
    }),
    actions: {
        set(settings) {
            this.congregation = settings.congregation
            this.user         = settings.user
        }
    },
    persist: {
        storage: sessionStorage,
    }
})
