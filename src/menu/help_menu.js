export default {
    label   : 'Hjälp',
    role    : 'help',
    submenu : [
        {
            label : 'Dokumentation',
            click : async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://github.com/bjorkgard/secretary-app/wiki')
            },
        },
        {
            label : 'Rapportera fel / förslag',
            click : async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://github.com/bjorkgard/secretary-app/issues/new/choose')
            },
        },
        {
            label : 'Aktuella problem',
            click : async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://github.com/bjorkgard/secretary-app/issues')
            },
        },
    ],
}
