import { BrowserWindow } from 'electron'

export default {
  label   : 'Utvecklare',
  submenu : [
    {
      label       : 'Ladda om',
      accelerator : 'CmdOrCtrl+R',
      click       : () => {
        BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache()
      },
    },
    {
      label       : 'Växla DevTools',
      accelerator : 'Alt+CmdOrCtrl+I',
      click       : () => {
        BrowserWindow.getFocusedWindow().toggleDevTools()
      },
    },
  ],
}
