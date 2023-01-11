import { PublisherSchema } from '@/database/schemas'
import PublisherStore      from '@/database/publisherStore'

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
        contact         : null,
        address         : {
            address1 : '',
            address2 : null,
            zip      : '',
            city     : '',
        },
        phone        : '',
        cell         : '',
        email        : '',
        serviceGroup : null,
        status       : null,
        information  : '',
        emergency    : {
            name  : '',
            phone : '',
            email : '',
        },
        children     : [],
        appointments : [],
    }

    publisher.s290             = data.s290
    publisher.registerCard     = data.registerCard
    publisher.firstName        = data.firstName
    publisher.lastName         = data.lastName
    publisher.birthday         = data.birthday !== '' ? data.birthday : null
    publisher.gender           = data.gender
    publisher.baptised         = data.baptised !== '' ? data.baptised : null
    publisher.baptisedUnknown  = data.baptisedUnknown
    publisher.hope             = data.hope
    publisher.contactPerson    = data.contactPerson
    publisher.contact          = data.contact ? data.contact : null
    publisher.address.address1 = address.address1
    publisher.address.address2 = address.address2 !== '' ? data.address2 : null
    publisher.address.zip      = address.zip
    publisher.address.city     = address.city
    publisher.phone            = data.phone !== '' ? data.phone : null
    publisher.cell             = data.cell !== '' ? data.cell : null
    publisher.email            = data.email !== '' ? data.email : null
    publisher.serviceGroup     = data.serviceGroup ? data.serviceGroup : null
    publisher.status           = data.status
    publisher.information      = data.information !== '' ? data.information : null
    publisher.emergency.name   = data.emergencyName !== '' ? data.emergencyName : null
    publisher.emergency.phone  = data.emergencyPhone !== '' ? data.emergencyPhone : null
    publisher.emergency.email  = data.emergencyEmail !== '' ? data.emergencyEmail : null
    publisher.children         = data.children ? data.children : []
    publisher.appointments     = data.appointments ? data.appointments : []

    return publisher
}

const parsePublisher = (data) => {
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
        contact         : null,
        address1        : null,
        address2        : null,
        zip             : null,
        city            : null,
        phone           : '',
        cell            : '',
        email           : '',
        serviceGroup    : null,
        status          : null,
        information     : '',
        emergencyName   : '',
        emergencyPhone  : '',
        emergencyEmail  : '',
        children        : [],
        appointments    : [],
        createdAt       : '',
        updatedAt       : '',
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
    publisherModel.contact         = data.contact
    publisherModel.address1        = data.address.address1
    publisherModel.address2        = data.address.address2 ? data.address.address2 : ''
    publisherModel.zip             = data.address.zip
    publisherModel.city            = data.address.city
    publisherModel.phone           = data.phone
    publisherModel.cell            = data.cell
    publisherModel.email           = data.email
    publisherModel.serviceGroup    = data.serviceGroup
    publisherModel.status          = data.status
    publisherModel.information     = data.information
    publisherModel.emergencyName   = data.emergency.name ? data.emergency.name : ''
    publisherModel.emergencyPhone  = data.emergency.phone ? data.emergency.phone : ''
    publisherModel.emergencyEmail  = data.emergency.email ? data.emergency.email : ''
    publisherModel.children        = data.children
    publisherModel.appointments    = data.appointments
    publisherModel.createdAt       = data.createdAt.toLocaleString('sv-SE', { hour12: false })
    publisherModel.updatedAt       = data.updatedAt.toLocaleString('sv-SE', { hour12: false })

    return publisherModel
}

export default class PublisherService {
    async getAddress(data) {
        let address = null

        if(data.contactPerson){
            if(data.address){
                address = data.address
            } else {
                address = {
                    address1 : data.address1,
                    address2 : data.address2,
                    zip      : data.zip,
                    city     : data.city,
                }
            }
        } else {
            let publisher = await publisherStore.findOneById(data.contact.value)
            address       = publisher.address
        }

        return address
    }

    async create(data) {
        let address        = await this.getAddress(data)
        const publisher    = parsePublisherModel(data, address)
        const newPublisher = await publisherStore.create(publisher)

        return newPublisher
    }

    async update(publisherId, data) {
        let address     = await this.getAddress(data)
        const publisher = parsePublisherModel(data, address)

        if(publisher.contactPerson){
            // update family members address
            let publishers = await publisherStore.findBy('contact.value', publisherId)
            publishers.forEach(async publisher => {
                publisher.address = address

                await publisherStore.update(publisher._id, publisher)
            })
        }

        return await publisherStore.update(publisherId, publisher)
    }

    async delete(data) {
        let p = await publisherStore.findOneById(data.id)

        if(p.contactPerson){
            // separate family members if the contact person is deleted
            let publishers = await publisherStore.findBy('contact.value', data.id)
            publishers.forEach(pub => {
                let publisher           = parsePublisherModel(pub)
                publisher.contactPerson = true
                publisher.contact       = null

                publisherStore.update(publisher._id, publisher)
            })
        }

        return await publisherStore.delete(data.id)
    }

    async contacts() {
        const contacts = await publisherStore.contacts()

        return contacts
    }

    async find(data) {
        let publishers = await publisherStore.find(data)

        const parsedPublishers = publishers.map((pub) => {
            return parsePublisher(pub)
        })

        return parsedPublishers
    }

    async findNew() {
        const publishers = await publisherStore.findNew()

        return publishers
    }

    async findBy(property, value) {
        const publishers = await publisherStore.findBy(property, value)

        return publishers
    }

    async findOneById(id) {
        const publisher = await publisherStore.findOneById(id)

        return parsePublisher(publisher)
    }

    async deleteAll() {
        await publisherStore.deleteAll()
    }

    drop() {
        publisherStore.drop({})
    }

    async stats() {
        return await publisherStore.stats()
    }
}
