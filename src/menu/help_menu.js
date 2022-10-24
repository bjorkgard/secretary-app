import { shell } from 'electron'

export default {
    label   : 'Hjälp',
        submenu : [
            {
                label: 'Dokumentation',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/wiki');
                }
            },
            {
                label: 'Rapportera fel / förslag',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/issues/new/choose');
                }
            },
            {
                label: 'Aktuella problem',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/issues');
                }
            },
        ]
}
