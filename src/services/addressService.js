import { AddressSchema } from '@/database/schemas'
import AddressStore      from '@/database/addressStore'
import log               from 'electron-log'

const addressStore = new AddressStore('addresses.db', AddressSchema)

const parseAddressModel = (data) => {
    const address = {
        address1 : '',
        address2 : '',
        zip      : '',
        city     : '',
    }

    address.address1 = data.address1
    address.address2 = data.address2
    address.zip      = data.zip
    address.city     = data.city

    return address
}

const parseAddress = (data) => {
    const addressModel = {
        id        : '',
        address1  : '',
        address2  : null,
        zip       : '',
        city      : '',
        createdAt : '',
        updatedAt : '',
    }

    addressModel.id        = data._id
    addressModel.address1  = data.address1
    addressModel.address2  = data.address2
    addressModel.zip       = data.zip
    addressModel.city      = data.city
    addressModel.createdAt = data.createdAt.toISOString()
    addressModel.updatedAt = data.updatedAt.toISOString()

    return addressModel
}

export default class AddressService {
    async create(data) {
        const address    = parseAddressModel(data)
        const newAddress = await addressStore.create(address)

        return parseAddress(newAddress)
    }

    async findOneById(id) {
        const address = await addressStore.findOneById(id)

        if (address){
            return parseAddress(address)
        }

        return null
    }

    upsert(id, address) {
        addressStore.upsert(id, address)
    }

    drop() {
        addressStore.drop({})
    }

    async stats() {
        return await addressStore.stats()
    }
}
