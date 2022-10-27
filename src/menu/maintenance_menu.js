import { ipcMain } from 'electron'

export default {
    label   : 'Underhåll',
    submenu : [
        {
            label: 'Skapa en backup',
            click() {
                ipcMain.emit('generate-backup', { function: 'backupDatabases' })
            },
        },
        {
            label: 'Återskapa från backup',
            click() {
                ipcMain.emit('recover-backup', { function: 'recoverDatabases' })
            },
        },
        { type: 'separator' },
        {
            label: 'Radera databas',
            click() {
                ipcMain.emit('show-confirmation-dialog', { function: 'destroyDatabases' })
            },
        },
    ],
}
