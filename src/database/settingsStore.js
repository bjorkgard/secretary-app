import BaseStore from './baseStore'

export default class SettingsStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    find() {
        return this.databaseInstance.find()
    }
}
