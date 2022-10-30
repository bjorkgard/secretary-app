import BaseStore from './baseStore'

export default class DatesStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    findByType(type) {
        return this.databaseInstance.find({ type: type })
    }

    upsert(type, date) {
        return this.databaseInstance.update({ type: type }, { type: type, date: date }, { upsert: true })
    }
}
