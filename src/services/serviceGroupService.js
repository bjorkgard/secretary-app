import { ServiceGroupSchema } from '@/database/schemas'
import ServiceGroupStore      from '@/database/serviceGroupStore'

const serviceGroupStore = new ServiceGroupStore('service_groupes.db', ServiceGroupSchema)

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

    async update(serviceGroupId, data) {
        const serviceGroup = parseServiceGroupModel(data)

        return await serviceGroupStore.update(serviceGroupId, serviceGroup)
    }

    async findAll() {
        const serviceGroups = []
        const sg            = await serviceGroupStore.findAll()
        sg.forEach((serviceGroup) => {
            serviceGroups.push(parseServiceGroup(serviceGroup))
        })

        return serviceGroups
    }

    drop() {
        serviceGroupStore.drop({})
    }

    async stats() {
        return await serviceGroupStore.stats()
    }
}
