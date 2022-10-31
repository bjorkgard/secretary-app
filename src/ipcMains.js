import { app, ipcMain, dialog } from 'electron'
import fs                       from 'fs-extra'
import log                      from 'electron-log'
import DatesService             from '@/services/datesService'
import SettingsService          from '@/services/settingsService'
import MaintenenceService       from '@/services/maintenenceService'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const enableIPC = () => {
    const maintenenceService = new MaintenenceService()
    const datesService       = new DatesService()
    const settingsService    = new SettingsService()

    /** Main features ***/
    ipcMain.handle('quit', async() => {
        app.quit()
    })

    ipcMain.handle('locale', async() => {
        return app.getLocale()
    })

    ipcMain.handle('version', async() => {
        return app.getVersion()
    })

    /*** Dates store */
    ipcMain.handle('statsDates', async () => {
        return await datesService.stats()
    })

    /*** Settings store ***/
    ipcMain.handle('statsSettings', async () => {
        return await settingsService.stats()
    })

    ipcMain.handle('getSettings', async () => {
        return await settingsService.find()
    })

    ipcMain.handle('storeSettings', async (event, data) => {
        return await settingsService.create(data)
    })

    ipcMain.handle('updateSettings', async (event, settingsId, data) => {
        return await settingsService.update(settingsId, data)
    })

    ipcMain.on('show-confirmation-dialog', (arg) => {
        const options = {
            type      : 'question',
            buttons   : [ 'OK', 'Avbryt' ],
            defaultId : 0,
            title     : 'Bekräfta',
            message   : 'Är du säker på att du vill fortsätta?',
            detail    : 'Detta går inte att ångra',
        }

        dialog.showMessageBox(null, options).then(result => {
            // Bail if the user pressed "No" or escaped (ESC) from the dialog box
            if (result.response !== 0) { return }

            if(result.response === 0){
                eval(arg.function+'()')
            }
        })
    })

    ipcMain.on('generate-backup', (arg) => {
        eval(arg.function+'()')
    })

    ipcMain.on('recover-backup', () => {
        const userDataPath = isDevelopment ? './db': app.getPath('userData') + '/db'

        let options = {
            title       : 'Återställ från backup',
            buttonLabel : 'Återställ',
            filters     : [
                { name: 'json', extensions: [ 'json' ] },
            ],
            properties: [ 'openFile' ],
        }

        dialog.showOpenDialog(null, options).then(result => {
            fs.readFile(result.filePaths[ 0 ], (err, data) => {
                if (!err) {
                    let recoveryData = JSON.parse(data.toString())
                    let backupFiles  = recoveryData.backup

                    backupFiles.forEach(file => {
                        const [ firstKey, ...rest ] = Object.keys(file)

                        fs.writeFile(`${userDataPath}/${firstKey}`, file[ firstKey ], 'utf-8', (err, data) => {
                            if (err){
                                log.error(err)
                            }
                        })
                    })

                    const responseOptions = {
                        type      : 'info',
                        buttons   : [ 'OK' ],
                        defaultId : 0,
                        title     : 'Databasen är återställd',
                        message   : 'Din databas är återställd!',
                        detail    : 'Applikationen kommer nu att avslutas och när du startar den nästa gång kommer den nya databasen att läsas in.',
                    }

                    dialog.showMessageBox(null, responseOptions).then(() => {
                        app.quit()
                    })
                }
            })
        })
    })

    /**
     * Internal main functions
     */
    const backupDatabases = () => {
        log.info('Backup start', new Date())

        const date         = new Date()
        const dateString   = date.toLocaleDateString()
        const userDataPath = isDevelopment ? './db': app.getPath('userData') + '/db'

        datesService.upsert('backup', date)

        // generate backup file
        const backup = {
            'date'   : date,
            'backup' : [],
        }

        fs.readdir(userDataPath, (err, files) => {
            if(err){ log.error(err) }

            files.forEach(file => {
                if(file === '.DS_Store') {return}

                fs.readFile(`${userDataPath}/${file}`, 'utf-8', (err, data) => {
                    if(err){ log.error(err) }

                    let backupFile     = {
                        [ file ]: data,
                    }
                    backup[ 'backup' ] = backup[ 'backup' ].concat(backupFile)
                })
                log.info(file, new Date())
            })
        })

        let options = {
            title       : 'Spara backup',
            defaultPath : `secretary_backup_${dateString}.json`,
            buttonLabel : 'Spara',
        }

        dialog.showSaveDialog(null, options).then(({ filePath }) => {
            fs.writeFileSync(filePath, JSON.stringify(backup), 'utf-8')
        })

        log.info('Backup done', new Date())
    }

    const destroyDatabases = () => {
        maintenenceService.drop()

        const options = {
            type      : 'info',
            buttons   : [ 'OK' ],
            defaultId : 0,
            title     : 'Databasen är raderad',
            message   : 'Din databas är raderad!',
            detail    : 'Applikationen kommer nu att avslutas.',
        }

        dialog.showMessageBox(null, options)

        app.quit()
    }
}
