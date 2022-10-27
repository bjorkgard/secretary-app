import SettingsService from '@/services/settingsService'

const settingsService = new SettingsService()

export default class MaintenenceService {
    drop() {
        // TODO: delete all databases
        settingsService.drop()
    }
}
