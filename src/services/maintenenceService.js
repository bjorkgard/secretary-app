import DatesService        from '@/services/datesService'
import ExportsService      from '@/services/exportsService'
import PublisherService    from '@/services/publisherService'
import ServiceGroupService from '@/services/serviceGroupService'
import SettingsService     from '@/services/settingsService'
import TasksService        from '@/services/tasksService'
import log                 from 'electron-log'

const datesService        = new DatesService()
const exportsService      = new ExportsService()
const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()
const settingsService     = new SettingsService()
const tasksService        = new TasksService()

export default class MaintenenceService {
    drop() {
        // TODO: delete all databases
        datesService.drop()
        exportsService.drop()
        publisherService.drop()
        serviceGroupService.drop()
        settingsService.drop()
        tasksService.drop()
    }

    seed() {
        tasksService.upsert('ACCOUNTANT', true)
        tasksService.upsert('ACCOUNTANT_OPERATING_GROUP', true)
        tasksService.upsert('AUXILIARY_COUNSELOR', true)
        tasksService.upsert('BOOKKEEPER', true)
        tasksService.upsert('BOOKKEEPER_HELPER', true)
        tasksService.upsert('CHAIRMAN', true)
        tasksService.upsert('CHAIRMAN_MIDWEEK', true)
        tasksService.upsert('CLEANING', true)
        tasksService.upsert('COORDINATOR', true)
        tasksService.upsert('COUNSELOR_EXTRA', true)
        tasksService.upsert('DISTRICT', true)
        tasksService.upsert('DISTRICT_RESPONSIBLE', true)
        tasksService.upsert('GROUP_OVERSEER', true)
        tasksService.upsert('GROUP_SERVANT', true)
        tasksService.upsert('HOST', true)
        tasksService.upsert('HOST_RESPONSIBLE', true)
        tasksService.upsert('INTERPRETER', true)
        tasksService.upsert('LECTURE', true)
        tasksService.upsert('LITERATURE', true)
        tasksService.upsert('LITERATURE_RESPONSIBLE', true)
        tasksService.upsert('MEETING_OVERSEER', true)
        tasksService.upsert('MICROPHONES', true)
        tasksService.upsert('OPERATING_GROUP', true)
        tasksService.upsert('PATIENT_VISITING', true)
        tasksService.upsert('PRAY', true)
        tasksService.upsert('READER_CS', true)
        tasksService.upsert('READER_WT', true)
        tasksService.upsert('SECRETARY', true)
        tasksService.upsert('SERVICE_OVERSEER', true)
        tasksService.upsert('SOUND_STAGE', true)
        tasksService.upsert('SOUND_STAGE_RESPONSIBLE', true)
        tasksService.upsert('TECHNICAL_SUPPORT', true)
        tasksService.upsert('WATCHTOWER_STUDY_CONDUCTOR', true)
        tasksService.upsert('WATCHTOWER_STUDY_CONDUCTOR_EXTRA', true)
    }
}
