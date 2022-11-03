import BaseStore from './baseStore'

export default class AddressStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    upsert(id, address) {
        return this.databaseInstance.update({ _id: id }, { address1: address.address1, address2: address.address2, zip: address.zip, city: address.city }, { upsert: true })
    }
}
