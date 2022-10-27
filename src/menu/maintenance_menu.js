import { ipcMain } from 'electron'

export default {
    label   : 'Underhåll',
    submenu : [
        {
            label: 'Backup',
            click() {
                console.log('backup')
            },
        },
        {
            label: 'Återskapa från backup',
            click() {
                console.log('import')
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
