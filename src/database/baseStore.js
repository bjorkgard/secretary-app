import electron   from 'electron'
import Ajv        from 'ajv'
import addFormats from 'ajv-formats'
import Datastore  from 'nedb-promises'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default class BaseStore {
    constructor(fileName, schema) {
        const userDataPath    = isDevelopment ? './db': (electron.app || electron.remote.app).getPath('userData') + '/db'
        this.filePath         = `${userDataPath}/${fileName}`
        this.databaseInstance = Datastore.create({
            filename      : this.filePath,
            timestampData : true,
            autoload      : true,
        })
        this.schema           = schema
    }

    validate(data) {
        const ajv = new Ajv({
            allErrors   : true,
            useDefaults : true,
        })

        addFormats(ajv)

        ajv.addFormat('custom-date-time', (dateTimeString) => {
            if (typeof dateTimeString === 'object') {
                dateTimeString = dateTimeString.toISOString()
            }
            return !isNaN(Date.parse(dateTimeString))
        })

        const schemaValidator = ajv.compile(this.schema)

        return schemaValidator(data)
    }

    create(data) {
        const isValid = this.validate(data)

        if (isValid) {
            return this.databaseInstance.insert(data)
        }
    }

    update(_id, data) {
        const isValid = this.validate(data)
        if (isValid) {
            return this.databaseInstance.update({ _id }, data)
        }
    }

    findOneById(_id) {
        return this.databaseInstance.findOne({ _id })
    }

    drop() {
        this.databaseInstance.dropDatabaseAsync()
    }

}
