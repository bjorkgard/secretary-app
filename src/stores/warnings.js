import { defineStore, acceptHMRUpdate } from 'pinia'

export const useWarningsStore = defineStore('warnings', {
    state: () => ({
        warnings: [],
    }),
    actions: {
        set(warnings) {
            this.warnings = warnings
        },
        add(warning) {
            this.warnings.push(warning)
        },
        remove(type) {
            this.warnings = this.warnings.filter(warning => {
                return warning.type !== type
            })
        },
    },
    persist: {
        storage: sessionStorage,
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWarningsStore, import.meta.hot))
}
