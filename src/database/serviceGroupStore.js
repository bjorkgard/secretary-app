import BaseStore from './baseStore'

export default class ServiceGroupStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    findAll() {
        return this.databaseInstance.find().sort({ name: 1 })
    }
}
