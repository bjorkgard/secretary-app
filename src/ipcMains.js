import { app, ipcMain } from 'electron'
import SettingsService  from '@/services/settingsService'

export const enableIPC = () => {
    const settingsService = new SettingsService()

    /** Main features ***/
    ipcMain.handle('quit', async() => {
        app.quit()
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
}
