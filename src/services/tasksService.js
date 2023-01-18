import { TasksSchema }  from '@/database/schemas'
import TasksStore       from '@/database/tasksStore'
import PublisherService from '@/services/publisherService'
import log              from 'electron-log'

const tasksStore       = new TasksStore('tasks.db', TasksSchema)
const publisherService = new PublisherService()

const parseTaskModel = (data) => {
    const task = {
        type      : '',
        name      : '',
        mandatory : false,
    }

    task.type      = data.type
    task.name      = data.name
    task.mandatory = data.mandatory

    return task
}

const parseTask = (data) => {
    const taskModel = {
        id        : '',
        type      : '',
        name      : '',
        mandatory : false,
    }

    taskModel.id        = data._id
    taskModel.type      = data.type
    taskModel.name      = data.name
    taskModel.mandatory = data.mandatory

    return taskModel
}

export default class TasksService {
    async findByType(type) {
        const tasks = await tasksStore.findByType(type)

        if (date.length > 0){
            return parseTask(tasks[ 0 ])
        }

        return null
    }

    async findAll(args) {
        const parsedTasks = []
        let tasks         = await tasksStore.find()

        for(const task of tasks){
            let t = parseTask(task)

            if(args) {
                if(args.countPublishers){
                    // Get publishers with task
                    let publishers    = await publisherService.findBy('tasks', t.id)
                    t.countPublishers = publishers.length
                }
            }

            t.name = task.name||task.type

            parsedTasks.push(t)
        }

        // Sort Task on translated name
        parsedTasks.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

        return parsedTasks
    }

    async create(data) {
        const task    = parseTaskModel(data)
        const newTask = await tasksStore.create(task)

        return parseTask(newTask)
    }

    upsert(type, mandatory) {
        tasksStore.upsert(type, mandatory)
    }

    drop() {
        tasksStore.drop({})
    }

    async stats() {
        return await tasksStore.stats()
    }
}
