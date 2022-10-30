import DatesService    from '@/services/datesService'
import SettingsService from '@/services/settingsService'

const datesService    = new DatesService()
const settingsService = new SettingsService()

export default class MaintenenceService {
    drop() {
        // TODO: delete all databases
        datesService.drop()
        settingsService.drop()
    }
}
