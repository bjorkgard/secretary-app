import log       from 'electron-log'
import BaseStore from './baseStore'

export default class PublisherStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    find(data) {
        log.info(data)
        //return this.databaseInstance.find().sort({ lastName: 1, contactPerson: -1, firstName: 1 })
        return this.databaseInstance.find().sort({ lastName: 1, firstName: 1 })
    }

    contacts() {
        return this.databaseInstance.find({ contactPerson: true }, { firstName: 1, lastName: 1 }).sort({ lastName: 1, firstName: 1 })
    }
}
