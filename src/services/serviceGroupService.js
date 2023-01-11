import { ServiceGroupSchema } from '@/database/schemas'
import ServiceGroupStore      from '@/database/serviceGroupStore'
import PublisherService       from '@/services/publisherService'

const serviceGroupStore = new ServiceGroupStore('service_groupes.db', ServiceGroupSchema)
const publisherService  = new PublisherService()

const parseServiceGroupModel = (data) => {
    const serviceGroup = {
        name: '',
    }

    serviceGroup.name = data.name

    return serviceGroup
}

const parseServiceGroup = (data) => {
    const serviceGroupModel = {
        id        : '',
        name      : '',
        createdAt : '',
        updatedAt : '',
    }

    serviceGroupModel.id        = data._id
    serviceGroupModel.name      = data.name
    serviceGroupModel.createdAt = data.createdAt.toLocaleString('sv-SE', { hour12: false })
    serviceGroupModel.updatedAt = data.updatedAt.toLocaleString('sv-SE', { hour12: false })

    return serviceGroupModel
}

export default class ServiceGroupService {
    async create(data) {
        const serviceGroup    = parseServiceGroupModel(data)
        const newServiceGroup = await serviceGroupStore.create(serviceGroup)

        return parseServiceGroup(newServiceGroup)
    }

    async delete(data) {
        return await serviceGroupStore.delete(data.id)
    }

    async update(serviceGroupId, data) {
        const serviceGroup = parseServiceGroupModel(data)

        const publishers = await publisherService.findBy('serviceGroup.value', serviceGroupId)
        publishers.forEach(async publisher => {
            publisher.serviceGroup.name = data.name

            await publisherService.update(publisher._id, publisher)
        })

        return await serviceGroupStore.update(serviceGroupId, serviceGroup)
    }

    async findOneById(id) {
        const serviceGroup = await serviceGroupStore.findOneById(id)

        return parseServiceGroup(serviceGroup)
    }

    async findAll(args) {
        const serviceGroups = []
        const groups        = await serviceGroupStore.findAll()

        for(const group of groups){
            let sg = parseServiceGroup(group)

            if(args){
                if(args.publishers){
                    // Count publishers in serviceGroup
                    let publishers         = await publisherService.findBy('serviceGroup.value', sg.id)
                    group.publishers_count = publishers.length
                }
            }

            serviceGroups.push(group)
        }

        return serviceGroups
    }

    async deleteAll() {
        await serviceGroupStore.deleteAll()
    }

    drop() {
        serviceGroupStore.drop({})
    }

    async stats() {
        return await serviceGroupStore.stats()
    }
}
