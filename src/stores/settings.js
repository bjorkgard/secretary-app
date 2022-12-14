import { defineStore, acceptHMRUpdate } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        identifier   : '',
        congregation : {},
        user         : {},
        settings     : {},
    }),
    actions: {
        set(settings) {
            this.identifier   = settings.identifier
            this.congregation = settings.congregation
            this.user         = settings.user
            this.settings     = settings.settings
        },
    },
    persist: {
        storage: sessionStorage,
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
