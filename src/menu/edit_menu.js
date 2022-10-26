export default {
    label   : 'Redigera',
    submenu : [
        { label: 'Ångra', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Gör om', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Klipp ut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Kopiera', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Klistra in', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Markera allt', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    ],
}
