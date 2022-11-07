import log       from 'electron-log'
import BaseStore from './baseStore'

export default class PublisherStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    find(data) {
        log.info(data)
        let searchQuery = data.searchQuery
        let sort        = {}
        let query       = {}

        //return this.databaseInstance.find().sort({ lastName: 1, contactPerson: -1, firstName: 1 })
        switch (data.sort) {
            case 'standard':
                sort = { lastName: 1, firstName: 1 }
                break
            case 'standard_rev':
                sort = { lastName: -1, firstName: -1 }
                break
            case 'email':
                sort = { lastName: 1, firstName: 1 }
                break
            default:
                sort = { lastName: 1, firstName: 1 }
        }

        if(searchQuery && searchQuery !== ''){
            query = { $or: [
                { lastName: new RegExp(searchQuery, 'i') },
                { firstName: new RegExp(searchQuery, 'i') },
            ] }
        }

        return this.databaseInstance.find(query).sort(sort)
    }

    contacts() {
        return this.databaseInstance.find({ contactPerson: true }, { firstName: 1, lastName: 1 }).sort({ lastName: 1, firstName: 1 })
    }
}
