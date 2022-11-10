import { app, ipcMain, dialog } from 'electron'
import fs                       from 'fs-extra'
import log                      from 'electron-log'
import DatesService             from '@/services/datesService'
import SettingsService          from '@/services/settingsService'
import MaintenenceService       from '@/services/maintenenceService'
import PublisherService         from '@/services/publisherService'
import ServiceGroupService      from '@/services/serviceGroupService'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const enableIPC = () => {
    const maintenenceService  = new MaintenenceService()
    const datesService        = new DatesService()
    const settingsService     = new SettingsService()
    const publisherService    = new PublisherService()
    const serviceGroupService = new ServiceGroupService()

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

    /*** ServiceGroup store */
    ipcMain.handle('statsServiceGroups', async () => {
        return await serviceGroupService.stats()
    })

    ipcMain.handle('getServiceGroups', async (event, args) => {
        return await serviceGroupService.findAll(args)
    })

    ipcMain.handle('deleteServiceGroup', async (event, args) => {
        return await serviceGroupService.delete(args)
    })

    /*** Publishers store */
    ipcMain.handle('storePublisher', async (event, data) => {
        return await publisherService.create(data)
    })

    ipcMain.handle('getPublisher', async (event, data) => {
        return await publisherService.findOneById(data.id)
    })

    ipcMain.handle('getPublishers', async (event, data) => {
        return await publisherService.find(data)
    })

    ipcMain.handle('deletePublisher', async (event, id) => {
        return await publisherService.delete(id)
    })

    ipcMain.handle('statsPublishers', async () => {
        return await publisherService.stats()
    })

    ipcMain.handle('getContacts', async () => {
        return await publisherService.contacts()
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

    ipcMain.handle('exportData', async (event, args) => {
        const exportData = {
            'date' : new Date(),
            'type' : args.type,
            'data' : args.data,
        }

        let options = {
            title       : 'Spara export',
            defaultPath : args.name,
            buttonLabel : 'Spara',
        }

        dialog.showSaveDialog(null, options).then(({ filePath }) => {
            fs.writeFileSync(filePath, JSON.stringify(exportData), 'utf-8')
        })
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

    ipcMain.on('import-publisher', () => {
        let confirmedImport = true
        let options         = {
            title       : 'Importera en förkunnare',
            buttonLabel : 'Importera',
            filters     : [
                { name: 'json', extensions: [ 'json' ] },
            ],
            properties: [ 'openFile' ],
        }

        dialog.showOpenDialog(null, options).then(result => {
            fs.readFile(result.filePaths[ 0 ], async (err, data) => {
                if (!err) {
                    let importData = JSON.parse(data.toString())

                    if(importData.type !== 'publisher'){
                        confirmedImport     = false
                        const dialogOptions = {
                            type      : 'info',
                            buttons   : [ 'OK' ],
                            defaultId : 0,
                            title     : 'Felaktig import-fil',
                            message   : 'Filen du laddade upp är inte en korrekt import-fil för en förkunnare.',
                        }
                        dialog.showMessageBox(null, dialogOptions)
                    }

                    if(confirmedImport){
                        const responseOptions = {
                            type      : 'info',
                            buttons   : [ 'OK' ],
                            defaultId : 0,
                            title     : 'Förkunnaren är importerad',
                            message   : 'Förkunnaren är importerad!',
                        }

                        try{
                            await publisherService.create(importData.data)
                            dialog.showMessageBox(null, responseOptions)
                        }catch(err){
                            log.error(err)
                            responseOptions.title   = 'Okänt fel'
                            responseOptions.message = 'Okänt fel'
                            responseOptions.detail  = 'Det gick inte att importera förkunnaren'

                            dialog.showMessageBox(null, responseOptions)
                        }
                    }
                }
            })
        })
    })

    ipcMain.on('recover-backup', () => {
        const userDataPath  = isDevelopment ? './db': app.getPath('userData') + '/db'
        let confirmedBackup = true

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

                    if(recoveryData.type !== 'backup'){
                        confirmedBackup     = false
                        const dialogOptions = {
                            type      : 'info',
                            buttons   : [ 'OK' ],
                            defaultId : 0,
                            title     : 'Felaktig backup-fil',
                            message   : 'Filen du laddade upp är inte en korrekt backup-fil från Secretary.',
                            detail    : 'Din databas har inte blvit ändrad. Om du vill återföra en backup måste du välja en korrekt backup-fil.',
                        }
                        dialog.showMessageBox(null, dialogOptions)
                    }

                    if(confirmedBackup){
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
            'type'   : 'backup',
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
