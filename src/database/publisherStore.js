import BaseStore from './baseStore'

export default class PublisherStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    find() {
        return this.databaseInstance.find()
    }

    contacts() {
        return this.databaseInstance.find({ contactPerson: true }, { firstName: 1, lastName: 1, address: 1 }).sort({ lastName: 1, firstName: 1 })
    }
}
