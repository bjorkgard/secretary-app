'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { autoUpdater }                                   from "electron-updater"
import windowStateKeeper                                 from 'electron-window-state'
import { createProtocol }                                from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS }             from 'electron-devtools-installer'

import { setupMenus } from './menus.js';

const isDevelopment = process.env.NODE_ENV !== 'production'

autoUpdater.logger                       = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth  : 1400,
        defaultHeight : 768
      });

  // Create the browser window.
  win = new BrowserWindow({
    width          : mainWindowState.width,
    height         : mainWindowState.height,
    x              : mainWindowState.x,
    y              : mainWindowState.y,
    webPreferences : {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration  : process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation : !process.env.ELECTRON_NODE_INTEGRATION,
    }
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  setupMenus(app, win);
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.whenReady().then(() => {
    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', {version: app.getVersion()})
    })
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    //win.webContents.send('update_downloaded');
    const dialogOpts = {
        type    : 'info',
        buttons : ['Starta om', 'Vänta'],
        title   : 'Programuppdatering',
        message : process.platform === 'win32' ? releaseNotes : releaseName,
        detail  :
          'En ny version har laddats ner. Starta om programmet för att installera uppdateringarna.',
      }

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
});

autoUpdater.on('error', (error) => {
    console.error('There was a problem updating the application')
    console.error(error)
})
