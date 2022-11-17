import { DatesSchema } from '@/database/schemas'
import DatesStore      from '@/database/datesStore'

const datesStore = new DatesStore('dates.db', DatesSchema)

const parseDateModel = (data) => {
    const date = {
        type : '',
        date : '',
    }

    date.type = data.type
    date.date = data.date

    return date
}

const parseDate = (data) => {
    const dateModel = {
        id   : '',
        type : '',
        date : '',
    }

    dateModel.id   = data._id
    dateModel.type = data.type
    dateModel.date = data.date

    return dateModel
}

export default class DatesService {
    upsert(type, date) {
        datesStore.upsert(type, date)
    }

    async findByType(type) {
        const date = await datesStore.findByType(type)

        if (date.length > 0){
            return parseDate(date[ 0 ])
        }

        return null
    }

    drop() {
        datesStore.drop({})
    }

    async stats() {
        return await datesStore.stats()
    }
}
