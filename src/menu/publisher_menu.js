import { ipcMain } from 'electron'

export default {
    label   : 'Förkunnare',
    submenu : [
        {
            label       : 'Visa alla',
            accelerator : 'CmdOrCtrl+F',
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
                ipcMain.emit('import-publisher')
            },
        },
    ],
}
