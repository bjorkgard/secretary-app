import { ExportsSchema } from '@/database/schemas'
import ExportsStore      from '@/database/exportsStore'
import log               from 'electron-log'

const exportsStore = new ExportsStore('exports.db', ExportsSchema)

const parseExportsModel = (data) => {
    const date = {
        type  : '',
        count : 0,
    }

    date.type  = data.type
    date.count = data.count

    return date
}

const parseExports = (data) => {
    const exportsModel = {
        id        : '',
        name      : '',
        type      : '',
        count     : 0,
        createdAt : '',
        updatedAt : '',
    }

    exportsModel.id        = data._id
    exportsModel.name      = getName(data.type)
    exportsModel.type      = data.type
    exportsModel.count     = data.count
    exportsModel.createdAt = data.createdAt.toLocaleString('sv-SE', { hour12: false })
    exportsModel.updatedAt = data.updatedAt.toLocaleString('sv-SE', { hour12: false })

    return exportsModel
}

const getName = (type) => {
    switch(type){
        case 'export-address-list-name':
            return 'Adresslista (bokstavsordning)'
        case 'export-address-list-group':
            return 'Adresslista (gruppordning)'
        default:
            return type
    }
}

export default class ExportsService {
    upsert(type) {
        exportsStore.upsert(type)
    }

    async getPopularExports(limit) {
        const documents = await exportsStore.findPopular(limit)

        const exports = documents.map((doc) => {
            return parseExports(doc)
        })

        return exports
    }

    async findByType(type) {
        const exports = await exportsStore.findByType(type)

        if (exports.length > 0){
            return parseExports(exports[ 0 ])
        }

        return null
    }

    drop() {
        exportsStore.drop({})
    }

    async stats() {
        return await exportsStore.stats()
    }
}
