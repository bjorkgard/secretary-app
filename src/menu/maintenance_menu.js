import log from 'electron-log'

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
        {
            type: 'separator',
        },
        {
            label: 'Radera databas',
            click() {
                log.info('delete DB')
            },
        },
    ],
}
