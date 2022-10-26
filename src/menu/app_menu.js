import { app, shell } from 'electron'

export default {
    label   : 'Arkiv',
    submenu : [
        {
            label: 'Om Secretary',
            click() {
                //todo: show page in application
                shell.openExternal('https://github.com/bjorkgard/secretary-app')
            },
        },
        {
            type: 'separator',
        },
        {
            label       : 'Göm Secretary',
            accelerator : 'CmdOrCtrl+H',
            click       : () => { app.hide() },
        },
        {
            type: 'separator',
        },
        {
            label       : 'Avsluta',
            accelerator : 'CmdOrCtrl+Q',
            click       : () => {
                app.quit()
            },
        },
    ],
}
