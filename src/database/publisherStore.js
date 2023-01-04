import BaseStore from './baseStore'

export default class PublisherStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    findBy(property, value) {
        let searchQuery         = {}
        searchQuery[ property ] = value

        return this.databaseInstance.find(searchQuery).sort({ lastName: 1, firstName: 1 })
    }

    findNew() {
        return this.databaseInstance.find({ serviceGroup: null }).sort({ lastName: 1, firstName: 1 })
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
            case 'CELL':
                sort = { 'cell.formatted': 1 }
                break
            case 'CELL_REV':
                sort = { 'cell.formatted': -1 }
                break
            case 'PHONE':
                sort = { 'phone.formatted': 1 }
                break
            case 'PHONE_REV':
                sort = { 'phone.formatted': -1 }
                break
            case 'GROUP':
                sort = { 'serviceGroup.name': 1, lastName: 1, firstName: 1 }
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
        return this.databaseInstance.find({ contactPerson: true }).sort({ lastName: 1, firstName: 1 })
    }
}
