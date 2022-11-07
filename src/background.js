'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { autoUpdater }                                         from 'electron-updater'
import windowStateKeeper                                       from 'electron-window-state'
import { createProtocol }                                      from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS }                   from 'electron-devtools-installer'
import log                                                     from 'electron-log'

import { enableIPC } from './ipcMains'

// menus
import appMenu         from '@/menu/app_menu'
import devMenu         from '@/menu/dev_menu'
import editMenu        from '@/menu/edit_menu'
import helpMenu        from '@/menu/help_menu'
import maintenanceMenu from '@/menu/maintenance_menu'
import publisherMenu   from '@/menu/publisher_menu'
import windowMenu      from '@/menu/window_menu'

const isDevelopment = process.env.NODE_ENV !== 'production'

autoUpdater.logger                       = log
autoUpdater.logger.transports.file.level = 'info'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

const setApplicationMenu = () => {
    const menus = [ appMenu, editMenu, publisherMenu, windowMenu, maintenanceMenu, helpMenu ]
    if (isDevelopment) {
        menus.splice(3, 0, devMenu)
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth  : 1400,
        defaultHeight : 768,
    })

  // Create the browser window.
  win = new BrowserWindow({
    width                : mainWindowState.width,
    height               : mainWindowState.height,
    x                    : mainWindowState.x,
    y                    : mainWindowState.y,
    minWidth             : 520,
    minHeight            : 520,
    frame                : false,
    titleBarStyle        : 'hidden',
    titleBarOverlay      : true,
    trafficLightPosition : {
        x : 20,
        y : 20,
    },
    webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegrationInWorker : process.env.ELECTRON_NODE_INTEGRATION,
        nodeIntegration         : true,
        contextIsolation        : false,
    },
})

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win)

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
    enableIPC()
    setApplicationMenu()

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    createWindow()
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
    ipcMain.on('window-focus', (event, boolFocus) => {
        const webContents = event.sender
        if (webContents.backgroundThrottling && !isDevelopment)
            webContents.send ('window-focus-throttling', boolFocus)
    })

    ipcMain.on('about-window', () => {
        const modalPath = isDevelopment ? `${process.env.WEBPACK_DEV_SERVER_URL}#/about` : 'app://./index.html#about'
        let aboutWindow = new BrowserWindow({
            height         : 620,
            resizable      : false,
            width          : 750,
            title          : 'Om Secretary',
            minimizable    : false,
            fullscreenable : false,
            alwaysOnTop    : true,
            center         : true,
            webPreferences : { webSecurity: false, nodeIntegration: true, contextIsolation: false },

        })

        aboutWindow.loadURL(modalPath)
        //if (isDevelopment) aboutWindow.webContents.openDevTools()

        aboutWindow.on('closed', function() {
            aboutWindow = null
        })
    })


    ipcMain.on('show-publisher', () => {
        win.webContents.send('changeRouteTo', '/publishers')
    })

    ipcMain.on('add-publisher', () => {
        win.webContents.send('changeRouteTo', '/publishers/add')
    })
})

ipcMain.on('openConfirmation', (event, args) => {
    const webContents = event.sender
    dialog.showMessageBox(win, {
        'type'    : 'question',
        'title'   : 'Bekräfta',
        'message' : args.message,
        'buttons' : [
            'OK',
            'Avbryt',
        ],
    }).then((result) => {
        if (result.response !== 0) { return }

        // Reply to the render process
        webContents.send(args.responseListener, { response: result.response, ...args })
    }).catch( e => {
        log.error(e)
    })
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type    : 'info',
        buttons : [ 'Starta om', 'Vänta' ],
        title   : 'Programuppdatering',
        message : process.platform === 'win32' ? releaseNotes : releaseName,
        detail  :
          'En ny version har laddats ner. Starta om programmet för att installera uppdateringarna.',
      }

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
})

autoUpdater.on('error', (error) => {
    log.error('There was a problem updating the application')
    log.error(error)
})
