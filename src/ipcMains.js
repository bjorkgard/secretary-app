import { app, ipcMain, dialog } from 'electron'
import fs                       from 'fs-extra'
import Excel                    from 'exceljs'
import log                      from 'electron-log'
import DatesService             from '@/services/datesService'
import SettingsService          from '@/services/settingsService'
import MaintenenceService       from '@/services/maintenenceService'
import PublisherService         from '@/services/publisherService'
import ServiceGroupService      from '@/services/serviceGroupService'
import ExportsService           from '@/services/exportsService'

const isDevelopment       = process.env.NODE_ENV !== 'production'
const maintenenceService  = new MaintenenceService()
const datesService        = new DatesService()
const exportsService      = new ExportsService()
const settingsService     = new SettingsService()
const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()

const generateAddressList_PDF = async (publishers, name) => {
    const rows     = []
    const settings = await settingsService.find()



    try{
        //TODO: Trigger save pdf-file
    }catch(err){
        log.error(err)
    }
}

const generateAddressList_XLSX = async (publishers, name) => {
    const rows     = []
    const settings = await settingsService.find()

    publishers.map(publisher => {
        let address = publisher.address1
        if(publisher.address2){
            address += `\n${publisher.address2}`
        }
        address += `\n${publisher.zip} ${publisher.city}`

        rows.push([
            publisher.serviceGroup.name,
            `${publisher.lastName}, ${publisher.firstName}`,
            address,
            publisher.phone ? publisher.phone.formatted : '',
            publisher.cell ? publisher.cell.formatted : '',
            publisher.email,
            '',
        ])
    })

    const workbook   = new Excel.Workbook()
    workbook.creator = 'secretary.jwapp.info'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Sheet1', {
        pageSetup: {
            fitToPage        : true,
            paperSize        : 9,
            verticalCentered : true,
            showGridLines    : false,
            margins          : {
                left   : 0.2,
                right  : 0.2,
                top    : 0.75,
                bottom : 0.75,
                header : 0.3,
                footer : 0.1,
            },
        },
        headerFooter: {
            differentFirst : true,
            firstHeader    : '&C&8Tillgången är begränsad och sekretessbelagd.\nPersonuppgifter på papper förvaras i låsta arkivskåp som bara auktoriserad personal har tillgång till. (CRPA-Z; sfl 26:2)',
            firstFooter    : `&L&8&K000000${new Date().toLocaleString('sv-SE', { hour12: false })}&R&8&K000000Sida &P av &N`,
            oddFooter      : `&L&8&K000000${new Date().toLocaleString('sv-SE', { hour12: false })}&R&8&K000000Sida &P av &N`,
        },
        views: [
            { state: 'frozen', xSplit: 0, ySplit: 2 },
        ],
        columns: [
            { key: 'serviceGroup' },
            { key: 'name' },
            { key: 'address' },
            { key: 'phone' },
            { key: 'cell' },
            { key: 'email' },
            { key: 'other' },
        ],
    })

    worksheet.insertRow(1, [ settings.congregation.name ])
    worksheet.mergeCells('A1:G1')
    worksheet.insertRow(2, [ 'Tjänstegrupp', 'Namn', 'Adress', 'Telefon', 'Mobil', 'E-post', 'Övrigt' ])
    worksheet.getRow(1).font      = { size: 24, bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }
    worksheet.getRow(2).font      = { bold: true }
    worksheet.getRow(2).border    = { bottom: { style: 'medium' } }

    worksheet.addRows(rows)

    autoWidth(worksheet)

    worksheet.eachRow((row) => {
        row.alignment = { vertical: 'middle' }
    })

    try{
        saveXlsxFile(`${name}.xlsx`, workbook)
    }catch(err){
        log.error(err)
    }
}

/**
 * Autofit columns by width
 *
 * @param {Excel.worksheet} worksheet
 * @param {number} minimalWidth
 */
const autoWidth = (worksheet, minimalWidth = 5) => {
    worksheet.columns.forEach((column) => {
        let maxColumnLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {

            // do not calculate first row
            if(cell._row._number !== 1){
                maxColumnLength = Math.max(
                    maxColumnLength,
                    minimalWidth,
                    cell.value ? Math.max(...(cell.value.split('\n').map(el => el.length))) : 0,
                )
            }

        })
        column.width = maxColumnLength + 2
    })
}

const saveXlsxFile = (name, workbook) => {
    let options = {
        title       : 'Spara fil som',
        defaultPath : name,
        buttonLabel : 'Spara',
        filters     : [ {
            name       : 'Adresslista',
            extensions : [ 'xlsx', 'xls', 'xlsm', 'xlsb', 'xml', 'csv', 'ods', 'numbers' ],
        } ],
    }

    dialog.showSaveDialog(null, options)
        .then((response) => {
            if(!response.canceled) {
                if(workbook){
                    workbook.xlsx.writeFile(response.filePath)
                }
            }
        })
        .catch(err => {
            log.error(err)
        })
}

export const exportAddressListName = async (type) => {
    exportsService.upsert('export-address-list-name', type)
    const publishers = await publisherService.find({ sort: 'NAME' })

    let name = `AddressList_name_${new Date().toISOString().slice(0, 10)}`

    if(type === 'XLSX'){
        generateAddressList_XLSX(publishers, name)
    }else{
        generateAddressList_PDF(publishers, name)
    }
}

export const exportAddressListGroup = async (type) => {
    exportsService.upsert('export-address-list-group', type)
    const publishers = await publisherService.find({ sort: 'GROUP' })

    let name = `AddressList_group_${new Date().toISOString().slice(0, 10)}`

    if(type === 'XLSX'){
        generateAddressList_XLSX(publishers, name)
    }else{
        generateAddressList_PDF(publishers, name)
    }
}

export const enableIPC = () => {

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

    ipcMain.handle('getServiceGroup', async (event, data) => {
        return await serviceGroupService.findOneById(data.id)
    })

    ipcMain.handle('getServiceGroups', async (event, args) => {
        return await serviceGroupService.findAll(args)
    })

    ipcMain.handle('deleteServiceGroup', async (event, args) => {
        return await serviceGroupService.delete(args)
    })

    ipcMain.handle('storeServiceGroup', async (event, args) => {
        return await serviceGroupService.create(args)
    })

    ipcMain.handle('updateServiceGroup', async (event, id, data) => {
        return await serviceGroupService.update(id, data)
    })

    /*** Publishers store */
    ipcMain.handle('storePublisher', async (event, data) => {
        return await publisherService.create(data)
    })
    ipcMain.handle('updatePublisher', async (event, id, data) => {
        return await publisherService.update(id, data)
    })

    ipcMain.handle('getPublisher', async (event, data) => {
        return await publisherService.findOneById(data.id)
    })

    ipcMain.handle('getPublishers', async (event, data) => {
        return await publisherService.find(data)
    })

    ipcMain.handle('getNewPublishers', async (event) => {
        return await publisherService.findNew()
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

    /**
     * Dates store
     **/
    ipcMain.handle('statsDates', async () => {
        return await datesService.stats()
    })

    /**
     * Exports store
     **/
    ipcMain.handle('statsExports', async () => {
        return await exportsService.stats()
    })

    /**
     * Settings store
     **/
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

    /**
     * EXPORTS
     */
    ipcMain.handle('getPopularExports', async (event, limit) => {
        return await exportsService.getPopularExports(limit)
    })

    ipcMain.handle('export-address-list-name', (event, args) => {
        exportAddressListName(args.type)
    })

    ipcMain.handle('export-address-list-group', (event, args) => {
        exportAddressListGroup(args.type)
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
