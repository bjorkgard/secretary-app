import { ipcMain } from 'electron'
import log         from 'electron-log'

export default {
    label   : 'Förkunnare',
    submenu : [
        {
            label: 'Visa alla',
            click() {
                ipcMain.emit('show-publisher')
            },
        },
        {
            label       : 'Lägg till',
            accelerator : 'CmdOrCtrl+Alt+F',
            click() {
                ipcMain.emit('add-publisher')
            },
        },
        {
            label: 'Importera',
            click() {
                log.info('Importera förkunnare')
            },
        },
    ],
}
