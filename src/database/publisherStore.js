import log       from 'electron-log'
import BaseStore from './baseStore'

export default class PublisherStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    findBy(property, value) {
        let searchQuery         = {}
        searchQuery[ property ] = value

        return this.databaseInstance.find(searchQuery)
    }

    find(data) {
        let searchQuery = data.searchQuery
        let sort        = {}
        let query       = {}

        switch (data.sort) {
            case 'NAME':
                sort = { lastName: 1, firstName: 1 }
                break
            case 'NAME_REV':
                sort = { lastName: -1, firstName: -1 }
                break
            case 'EMAIL':
                sort = { email: 1 }
                break
            case 'EMAIL_REV':
                sort = { email: -1 }
                break
            case 'ADDRESS':
                sort = { 'address.address1': 1 }
                break
            case 'ADDRESS_REV':
                sort = { 'address.address1': -1 }
                break
            default:
                sort = { lastName: 1, firstName: 1 }
        }

        if(searchQuery && searchQuery !== ''){
            query = { $or: [
                { lastName: new RegExp(searchQuery, 'i') },
                { firstName: new RegExp(searchQuery, 'i') },
                { email: new RegExp(searchQuery, 'i') },
            ] }
        }

        return this.databaseInstance.find(query).sort(sort)
    }

    contacts() {
        return this.databaseInstance.find({ contactPerson: true }, { firstName: 1, lastName: 1 }).sort({ lastName: 1, firstName: 1 })
    }
}
