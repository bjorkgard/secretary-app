import BaseStore from './baseStore'
import log       from 'electron-log'

export default class DatesStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    findByType(type) {
        return this.databaseInstance.find({ type: type })
    }

    findPopular(args) {
        return this.databaseInstance.find({}).sort({ count: -1 }).limit(args.limit)
    }

    upsert(type) {
        return this.databaseInstance.update({ type: type }, { $inc: { count: 1 } }, { upsert: true })
    }
}
