import { ipcMain } from 'electron'

export default {
  label   : 'Exportera',
  submenu : [
    {
      label   : 'Förkunnare',
      submenu : [
        {
            label : 'Adresslista',
            click : () => {
                ipcMain.emit('export-address-list', { function: 'exportAddressList' })
            },
        },
        {
            label : 'Namnlista',
            click : () => {
                ipcMain.emit('export-name-list', { function: 'exportNameList' })
            },
        },
      ],

    },
  ],
}
