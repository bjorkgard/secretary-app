import AddressService      from '@/services/addressService'
import DatesService        from '@/services/datesService'
import PublisherService    from '@/services/publisherService'
import ServiceGroupService from '@/services/serviceGroupService'
import SettingsService     from '@/services/settingsService'

const addressService      = new AddressService()
const datesService        = new DatesService()
const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()
const settingsService     = new SettingsService()

export default class MaintenenceService {
    drop() {
        // TODO: delete all databases
        addressService.drop()
        datesService.drop()
        publisherService.drop()
        serviceGroupService.drop()
        settingsService.drop()
    }
}