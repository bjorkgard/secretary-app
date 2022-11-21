import { ipcMain }            from 'electron'
import {
    exportAddressListName,
    exportAddressListGroup,
} from '@/ipcMains'

export default {
  label   : 'Exportera',
  submenu : [
    {
      label   : 'Förkunnare',
      submenu : [
        {
            label   : 'Adresslista (bokstavsordning)',
            submenu : [
                {
                    label : 'PDF',
                    click : () => {
                        exportAddressListName('PDF')
                    },
                },
                {
                    label : 'XLSX',
                    click : () => {
                        exportAddressListName('XLSX')
                    },
                },
            ],
        },
        {
            label   : 'Adresslista (gruppordning)',
            submenu : [
                {
                    label : 'PDF',
                    click : () => {
                        exportAddressListGroup('PDF')
                    },
                },
                {
                    label : 'XLSX',
                    click : () => {
                        exportAddressListGroup('XLSX')
                    },
                },
            ],
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
