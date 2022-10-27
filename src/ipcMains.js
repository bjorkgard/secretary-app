import { app, ipcMain, dialog } from 'electron'
import SettingsService          from '@/services/settingsService'
import MaintenenceService       from '@/services/maintenenceService'
import log                      from 'electron-log'

export const enableIPC = () => {
    const settingsService    = new SettingsService()
    const maintenenceService = new MaintenenceService()

    /** Main features ***/
    ipcMain.handle('quit', async() => {
        app.quit()
    })

    ipcMain.handle('locale', async() => {
        return app.getLocale()
    })

    ipcMain.handle('version', async() => {
        return app.getVersion()
    })

    /*** Settings store ***/
    ipcMain.handle('getSettings', async () => {
        return await settingsService.find()
    })

    ipcMain.handle('storeSettings', async (event, data) => {
        return await settingsService.create(data)
    })

    ipcMain.handle('updateSettings', async (event, settingsId, data) => {
        return await settingsService.update(settingsId, data)
    })

    ipcMain.on('show-confirmation-dialog', (arg) => {
        const options = {
            type      : 'question',
            buttons   : [ 'OK', 'Avbryt' ],
            defaultId : 0,
            title     : 'Bekräfta',
            message   : 'Är du säker på att du vill fortsätta?',
            detail    : 'Detta går inte att ångra',
        }

        dialog.showMessageBox(null, options).then(result => {
            // Bail if the user pressed "No" or escaped (ESC) from the dialog box
            if (result.response !== 0) { return }

            if(result.response === 0){
                eval(arg.function+'()')
            }
        })
    })

    const destroyDatabases = () => {
        maintenenceService.drop()

        const options = {
            type      : 'info',
            buttons   : [ 'OK' ],
            defaultId : 0,
            title     : 'Databasen är raderad',
            message   : 'Din databas är raderad!',
            detail    : 'Applikationen kommer nu att avslutas.',
        }

        dialog.showMessageBox(null, options)

        app.quit()
    }
}
