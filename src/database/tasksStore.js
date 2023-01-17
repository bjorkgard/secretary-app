import BaseStore from './baseStore'

export default class TasksStore extends BaseStore {
    constructor(fileName, schema) {
        super(fileName, schema)
    }

    find() {
        return this.databaseInstance.find()
    }

    findByType(type) {
        return this.databaseInstance.find({ type: type })
    }

    upsert(type, mandatory) {
        return this.databaseInstance.update({ type: type }, { type: type, mandatory: mandatory }, { upsert: true })
    }

}
