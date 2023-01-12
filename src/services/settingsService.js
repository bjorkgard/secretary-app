import { SettingsSchema } from '@/database/schemas'
import SettingsStore      from '@/database/settingsStore'

const settingsStore = new SettingsStore('settings.db', SettingsSchema)

const parseSettingsModel = (data) => {
    const settings = {
        identifier   : '',
        congregation : {
            name               : '',
            number             : '',
            co                 : '',
            address            : '',
            zip                : '',
            city               : '',
            organizationNumber : '',
            phone              : '',
            email              : '',
        },
        user: {
            firstname : '',
            lastname  : '',
            email     : '',
        },
        settings: {
            online: false,
        },
    }

    settings.identifier                      = data.identifier
    settings.congregation.name               = data.congregation.name
    settings.congregation.number             = data.congregation.number
    settings.congregation.co                 = data.congregation.co
    settings.congregation.address            = data.congregation.address
    settings.congregation.zip                = data.congregation.zip
    settings.congregation.city               = data.congregation.city
    settings.congregation.organizationNumber = data.congregation.organizationNumber
    settings.congregation.phone              = data.congregation.phone
    settings.congregation.email              = data.congregation.email
    settings.user.firstname                  = data.user.firstname
    settings.user.lastname                   = data.user.lastname
    settings.user.email                      = data.user.email
    settings.settings.online                 = data.settings ? data.settings.online : false

    return settings
}

const parseSettings = (data) => {
    const settingsModel = {
        id           : '',
        identifier   : '',
        congregation : {
            name               : '',
            number             : '',
            co                 : '',
            address            : '',
            zip                : '',
            city               : '',
            organizationNumber : '',
            phone              : '',
            email              : '',
        },
        user: {
            firstname : '',
            lastname  : '',
            email     : '',
        },
        settings: {
            online: false,
        },
        createdAt : '',
        updatedAt : '',
    }

    settingsModel.id                              = data._id
    settingsModel.identifier                      = data.identifier
    settingsModel.congregation.name               = data.congregation.name
    settingsModel.congregation.number             = data.congregation.number
    settingsModel.congregation.co                 = data.congregation.co
    settingsModel.congregation.address            = data.congregation.address
    settingsModel.congregation.zip                = data.congregation.zip
    settingsModel.congregation.city               = data.congregation.city
    settingsModel.congregation.organizationNumber = data.congregation.organizationNumber
    settingsModel.congregation.phone              = data.congregation.phone
    settingsModel.congregation.email              = data.congregation.email
    settingsModel.user.firstname                  = data.user.firstname
    settingsModel.user.lastname                   = data.user.lastname
    settingsModel.user.email                      = data.user.email
    settingsModel.settings.online                 = data.settings.online ? data.settings.online : false
    settingsModel.createdAt                       = data.createdAt.toLocaleString('sv-SE', { hour12: false })
    settingsModel.updatedAt                       = data.updatedAt.toLocaleString('sv-SE', { hour12: false })

    return settingsModel
}

export default class SettingsService {
    async create(data) {
        const settings    = parseSettingsModel(data)
        const newSettings = await settingsStore.create(settings)
        return parseSettings(newSettings)
    }

    async update(settingsId, data) {
        const settings = parseSettingsModel(data)

        return await settingsStore.update(settingsId, settings)
    }

    async find() {
        const settings = await settingsStore.find().sort({ createdAt: 1 }).limit(1)

        if (settings.length > 0){
            return parseSettings(settings[ 0 ])
        }

        return null
    }

    async drop() {
        settingsStore.drop({})
    }

    async stats() {
        return await settingsStore.stats()
    }
}
