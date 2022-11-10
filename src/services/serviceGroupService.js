import { ServiceGroupSchema } from '@/database/schemas'
import ServiceGroupStore      from '@/database/serviceGroupStore'
import PublisherService       from '@/services/publisherService'
import log                    from 'electron-log'

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
        id   : '',
        name : '',
    }

    serviceGroupModel.id   = data._id
    serviceGroupModel.name = data.name

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

        return await serviceGroupStore.update(serviceGroupId, serviceGroup)
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

    drop() {
        serviceGroupStore.drop({})
    }

    async stats() {
        return await serviceGroupStore.stats()
    }
}
