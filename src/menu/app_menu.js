import { app, ipcMain } from 'electron'

export default {
    label   : 'Secretary',
    submenu : [
        {
            label: 'Om Secretary',
            click() {
                openAboutWindow()
            },
        },
        { type: 'separator' },
        {
            label       : 'Göm Secretary',
            accelerator : 'CmdOrCtrl+H',
            click       : () => { app.hide() },
        },
        { type: 'separator' },
        {
            label       : 'Avsluta',
            accelerator : 'CmdOrCtrl+Q',
            click       : () => {
                app.quit()
            },
        },
    ],
}

let aboutWindow = null

const openAboutWindow = () => {
    if (aboutWindow) {
        aboutWindow.focus()
        return
    }

    ipcMain.emit('about-window')
}
