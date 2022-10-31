import log from 'electron-log'

export default {
    label   : 'Förkunnare',
    submenu : [
        {
            label: 'Visa alla',
            click() {
                log.info('Visa alla förkunnare')
            },
        },
        {
            label: 'Lägg till',
            click() {
                log.info('Lägg till förkunnare')
            },
        },
        {
            label: 'Se borttagna',
            click() {
                log.info('Visa borttagna förkunnare')
            },
        },
    ],
}
