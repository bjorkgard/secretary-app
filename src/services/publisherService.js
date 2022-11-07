import { PublisherSchema } from '@/database/schemas'
import PublisherStore      from '@/database/publisherStore'
import log                 from 'electron-log'

const publisherStore = new PublisherStore('publishers.db', PublisherSchema)

const parsePublisherModel = (data, address) => {
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
        address         : null,
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
    publisher.address         = address
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

export default class PublisherService {
    async create(data) {
        let address = null

        if(data.contactPerson){
            address = {
                address1 : data.address1,
                address2 : data.address2,
                zip      : data.zip,
                city     : data.city,
            }
        } else {
            let publisher = await publisherStore.findOneById(data.contactId.value)
            address       = publisher.address
        }

        const publisher    = parsePublisherModel(data, address)
        const newPublisher = await publisherStore.create(publisher)

        return newPublisher
    }

    async update(publisherId, data) {
        const publisher = parsePublisherModel(data)

        return await publisherStore.update(publisherId, publisher)
    }

    async delete(data) {
        return await publisherStore.delete(data.id)
    }

    async contacts() {
        const contacts = await publisherStore.contacts()

        return contacts
    }

    async find(data) {
        const publishers = await publisherStore.find(data)

        return publishers
    }

    drop() {
        publisherStore.drop({})
    }

    async stats() {
        return await publisherStore.stats()
    }
}
