import { PublisherSchema } from '@/database/schemas'
import PublisherStore      from '@/database/publisherStore'
import log                 from 'electron-log'
import AddressService      from './addressService'

const publisherStore = new PublisherStore('publishers.db', PublisherSchema)
const addressService = new AddressService()

const parsePublisherModel = (data, addressId) => {
    const publisher = {
        s290            : false,
        registerCard    : false,
        firstName       : '',
        lastName        : '',
        birthday        : '',
        gender          : '',
        baptised        : '',
        baptisedUnknown : false,
        hope            : '',
        contactPerson   : false,
        contactId       : '',
        addressId       : '',
        phone           : '',
        cell            : '',
        email           : '',
        serviceGroupId  : '',
        status          : '',
        information     : '',
        emergency       : {
            name  : '',
            phone : '',
            email : '',
        },
        children: [],
    }

    publisher.s290            = data.s290
    publisher.registerCard    = data.registerCard
    publisher.firstName       = data.firstName
    publisher.lastName        = data.lastName
    publisher.birthday        = data.birthday !== '' ? data.birthday : null
    publisher.gender          = data.gender
    publisher.baptised        = data.baptised !== '' ? data.baptised : null
    publisher.baptisedUnknown = data.baptisedUnknown
    publisher.hope            = data.hope
    publisher.contactPerson   = data.contactPerson
    publisher.contactId       = data.contactId ? data.contactId.value : null
    publisher.addressId       = addressId
    publisher.phone           = data.phone !== '' ? data.phone : null
    publisher.cell            = data.cell !== '' ? data.cell : null
    publisher.email           = data.email !== '' ? data.email : null
    publisher.serviceGroupId  = data.serviceGroup.value
    publisher.status          = data.status.value
    publisher.information     = data.information !== '' ? data.information : null
    publisher.emergency.name  = data.emergencyName !== '' ? data.emergencyName : null
    publisher.emergency.phone = data.emergencyPhone !== '' ? data.emergencyPhone : null
    publisher.emergency.email = data.emergencyEmail !== '' ? data.emergencyEmail : null
    publisher.children        = data.children

    return publisher
}

const parsePublisher = (data, address) => {
    const publisherModel = {
        id              : '',
        s290            : false,
        registerCard    : false,
        firstName       : '',
        lastName        : '',
        birthday        : '',
        gender          : '',
        baptised        : '',
        baptisedUnknown : false,
        hope            : '',
        contactPerson   : false,
        contactId       : '',
        addressId       : '',
        address         : {
            address1 : '',
            address2 : '',
            zip      : '',
            city     : '',
        },
        phone          : '',
        cell           : '',
        email          : '',
        serviceGroupId : '',
        status         : '',
        information    : '',
        emergency      : {
            name  : '',
            phone : '',
            email : '',
        },
        children  : [],
        createdAt : '',
        updatedAt : '',
    }

    publisherModel.id              = data._id
    publisherModel.s290            = data.s290
    publisherModel.registerCard    = data.registerCard
    publisherModel.firstName       = data.firstName
    publisherModel.lastName        = data.lastName
    publisherModel.birthday        = data.birthday
    publisherModel.gender          = data.gender
    publisherModel.baptised        = data.baptised
    publisherModel.baptisedUnknown = data.baptisedUnknown
    publisherModel.hope            = data.hope
    publisherModel.contactPerson   = data.contactPerson
    publisherModel.contactId       = data.contactId
    publisherModel.addressId       = data.addressId
    publisherModel.address         = address
    publisherModel.phone           = data.phone
    publisherModel.cell            = data.cell
    publisherModel.email           = data.email
    publisherModel.serviceGroupId  = data.serviceGroupId
    publisherModel.status          = data.status
    publisherModel.information     = data.information
    publisherModel.emergency       = data.emergency
    publisherModel.children        = data.children
    publisherModel.createdAt       = data.createdAt.toISOString()
    publisherModel.updatedAt       = data.updatedAt.toISOString()

    return publisherModel
}

export default class PublisherService {
    async create(data) {
        let addressId    = null
        let addressModel = null
        if(data.contactPerson){
            addressModel = await addressService.create({
                address1 : data.address1,
                address2 : data.address2,
                zip      : data.zip,
                city     : data.city,
            })

            addressId = addressModel.id
        } else {
            let publisher = await publisherStore.findOneById(data.contactId.value)

            addressId = publisher.addressId
        }

        const publisher    = parsePublisherModel(data, addressId)
        const newPublisher = await publisherStore.create(publisher)
        const address      = await addressService.findOneById(addressId)

        return parsePublisher(newPublisher, address)
    }

    async update(publisherId, data) {
        const publisher = parsePublisherModel(data)

        return await publisherStore.update(publisherId, publisher)
    }

    async contacts() {
        const contacts = await publisherStore.contacts()

        return contacts
    }

    drop() {
        publisherStore.drop({})
    }

    async stats() {
        return await publisherStore.stats()
    }
}
