import { app, ipcMain, dialog }       from 'electron'
import fs                             from 'fs-extra'
import Excel                          from 'exceljs'
import pdfMake                        from 'pdfmake/build/pdfmake'
import pdfFonts                       from 'pdfmake/build/vfs_fonts'
import { v4 as uuidv4 }               from 'uuid'
import log                            from 'electron-log'
import DatesService                   from '@/services/datesService'
import SettingsService                from '@/services/settingsService'
import MaintenenceService             from '@/services/maintenenceService'
import PublisherService               from '@/services/publisherService'
import ServiceGroupService            from '@/services/serviceGroupService'
import ExportsService                 from '@/services/exportsService'
import TasksService                   from '@/services/tasksService'
import getPublisherRows               from '@/utils/getPublisherRows'
import getPublisherByFamilyRows       from '@/utils/getPublisherByFamilyRows'
import splitArray                     from '@/utils/splitArray'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

pdfMake.vfs = pdfFonts.pdfMake.vfs

const isDevelopment       = process.env.NODE_ENV !== 'production'
const maintenenceService  = new MaintenenceService()
const datesService        = new DatesService()
const exportsService      = new ExportsService()
const settingsService     = new SettingsService()
const publisherService    = new PublisherService()
const serviceGroupService = new ServiceGroupService()
const tasksService        = new TasksService()

const generateAddressList_PDF = async (publishers, name) => {
    const settings         = await settingsService.find()
    let publisherTableBody = getPublisherRows(publishers)

    let coAddress = settings.circuitOverseer.address1
    if(settings.circuitOverseer.address2){
        coAddress += `\n${settings.circuitOverseer.address2}`
    }
    coAddress += `\n${settings.circuitOverseer.zip} ${settings.circuitOverseer.city}`

    // add headers to the table body
    publisherTableBody.unshift([
        { text: 'Gr.', style: 'tableHeader' },
        { text: 'Namn', style: 'tableHeader' },
        { text: 'Adress', style: 'tableHeader' },
        { text: 'Telefon', style: 'tableHeader' },
        { text: 'Mobil', style: 'tableHeader' },
        { text: 'E-post', style: 'tableHeader' },
        { text: 'Övrigt', style: 'tableHeader' },
    ])

    let docDefinition = {
        info: {
            title    : 'Address list',
            author   : `${settings.user.firstname} ${settings.user.lastname}`,
            subject  : 'Address list for publishers in the congregation',
            keywords : 'secretary, address, publisher',
        },
        pageOrientation : 'portrait',
        pageSize        : 'A4',
        pageMargins     : [ 15, 10, 15, 20 ],
        footer          : function(currentPage, pageCount) {
            let d = new Date()
            return [
                {
                    columns: [
                        { text: currentPage.toString() + ' av ' + pageCount, fontSize: 6, margin: [ 10, 0, 0, 0 ] },
                        { text: d.toLocaleString(app.getLocale()), alignment: 'right', fontSize: 6, margin: [ 0, 0, 10, 0 ] },
                    ],
                },
            ]
        },
        content: [
            { text: settings.congregation.name, style: 'header' },
            { text: 'Tillgången är begränsad och sekretessbelagd.\nPersonuppgifter på papper förvaras i låsta arkivskåp som bara auktoriserad personal har tillgång till. (CRPA-Z; sfl 26:2)', style: 'subHeader' },
            {
                layout : 'addressListLayout',
                table  : {
                    dontBreakRows : true,
                    headerRows    : 1,
                    widths        : [ 'auto', 'auto', 75, 52, 52, 'auto', '*' ],
                    body          : publisherTableBody,
                },
                style: 'table',
            },
            { text: 'Kretstillsyningsmannen', style: 'coHeader' },
            {
                layout : 'addressListLayout',
                table  : {
                    dontBreakRows : true,
                    headerRows    : 1,
                    widths        : [ '*', '*', 52, '*' ],
                    body          : [
                        [
                            { text: 'Namn', style: 'tableHeader' },
                            { text: 'Adress', style: 'tableHeader' },
                            { text: 'Telefon', style: 'tableHeader' },
                            { text: 'E-postadress', style: 'tableHeader' },
                        ],
                        [ `${settings.circuitOverseer.lastName}, ${settings.circuitOverseer.firstName}`,
                        coAddress,
                        settings.circuitOverseer.phone ? settings.circuitOverseer.phone.formatted : '',
                        settings.circuitOverseer.email ],
                    ],
                },
                style: 'table',
            },
        ],
        defaultStyles: {
            fontSize   : 8,
            lineHeight : 1.2,
        },
        styles: {
            header: {
                fontSize  : 22,
                bold      : true,
                alignment : 'center',
            },
            subHeader: {
                fontSize  : 8,
                alignment : 'center',
                margin    : [ 0, 0, 0, 10 ],
            },
            coHeader: {
                fontSize  : 8,
                bold      : true,
                alignment : 'left',
                color     : 'black',
                margin    : [ 0, 10, 0, 0 ],
            },
            tableHeader: {
                bold     : true,
                fontSize : 8,
                color    : 'black',
            },
            table: {
                fontSize : 8,
                color    : 'black',
            },
            tableInactive: {
                color: 'blue',
            },
        },
    }

    savePdfFile(`${name}.pdf`, docDefinition)
}

const generateAddressList_XLSX = async (publishers, name) => {
    const settings = await settingsService.find()
    const rows     = getPublisherRows(publishers)

    let coAddress = settings.circuitOverseer.address1
    if(settings.circuitOverseer.address2){
        coAddress += `\n${settings.circuitOverseer.address2}`
    }
    coAddress += `\n${settings.circuitOverseer.zip} ${settings.circuitOverseer.city}`

    const workbook   = new Excel.Workbook()
    workbook.creator = settings.congregation.name
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
    worksheet.insertRow(2, [ 'Grupp', 'Namn', 'Adress', 'Telefon', 'Mobil', 'E-post', 'Övrigt' ])
    worksheet.getRow(1).font      = { size: 24, bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }
    worksheet.getRow(2).font      = { bold: true }
    worksheet.getRow(2).border    = { bottom: { style: 'medium' } }

    worksheet.addRows(rows)
    worksheet.addRow([ '', '', '', '', '', '', '' ])
    worksheet.addRow([ '', '', '', '', '', '', '' ])
    let row  = worksheet.addRow([ '', 'Kretstillsyningsmannen', '', '', '', '', '' ])
    row.font = { size: 12, bold: true }
    row.mergeCells
    worksheet.addRow([ '', `${settings.circuitOverseer.lastName}, ${settings.circuitOverseer.firstName}`, coAddress, '', settings.circuitOverseer.phone.formatted, settings.circuitOverseer.email, '' ])

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

const generateNameList_PDF = async (publishers, name) => {
    const settings         = await settingsService.find()
    const rows             = await getPublisherByFamilyRows(publishers, publisherService)
    const columns          = splitArray(rows, 3)
    let publisherTableBody = []

    for (let index = 0; index < columns[ 0 ].length; index++) {
        publisherTableBody.push([
            columns[ 0 ][ index ] ? columns[ 0 ][ index ][ 0 ] : '',
            columns[ 1 ][ index ] ? columns[ 1 ][ index ][ 0 ] : '',
            columns[ 2 ][ index ] ? columns[ 2 ][ index ][ 0 ] : '',
        ])
    }

    // add headers to the table body
    publisherTableBody.unshift([
        { text: 'Namn', style: 'tableHeader' },
        { text: '', style: 'tableHeader' },
        { text: '', style: 'tableHeader' },
    ])

    let docDefinition = {
        info: {
            title    : 'Name list',
            author   : `${settings.user.firstname} ${settings.user.lastname}`,
            subject  : 'Name list for publishers in the congregation',
            keywords : 'secretary, name, publisher',
        },
        pageOrientation : 'portrait',
        pageSize        : 'A4',
        pageMargins     : [ 20, 10, 20, 20 ],
        footer          : function(currentPage, pageCount) {
            let d = new Date()
            return [
                {
                    columns: [
                        { text: currentPage.toString() + ' av ' + pageCount, fontSize: 6, margin: [ 10, 0, 0, 0 ] },
                        { text: d.toLocaleString(app.getLocale()), alignment: 'right', fontSize: 6, margin: [ 0, 0, 10, 0 ] },
                    ],
                },
            ]
        },
        content: [
            { text: settings.congregation.name, style: 'header' },
            {
                layout : 'lightHorizontalLines',
                table  : {
                    dontBreakRows : true,
                    headerRows    : 1,
                    widths        : [ '*', '*', '*' ],
                    body          : publisherTableBody,
                },
                style: 'table',
            },
        ],
        defaultStyles: {
            fontSize   : 8,
            lineHeight : 1.2,
        },
        styles: {
            header: {
                fontSize  : 22,
                bold      : true,
                alignment : 'center',
            },
            subHeader: {
                fontSize  : 8,
                alignment : 'center',
                margin    : [ 0, 0, 0, 10 ],
            },
            tableHeader: {
                bold     : true,
                fontSize : 8,
                color    : 'black',
            },
            table: {
                fontSize : 8,
                color    : 'black',
            },
            tableInactive: {
                color: 'blue',
            },
        },
    }

    savePdfFile(`${name}.pdf`, docDefinition)
}

const generateNameList_XLSX = async (publishers, name) => {
    const settings = await settingsService.find()
    const rows     = await getPublisherByFamilyRows(publishers, publisherService)
    const columns  = splitArray(rows, 3)

    const workbook   = new Excel.Workbook()
    workbook.creator = settings.congregation.name
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
            firstFooter    : `&L&8&K000000${new Date().toLocaleString('sv-SE', { hour12: false })}&R&8&K000000Sida &P av &N`,
            oddFooter      : `&L&8&K000000${new Date().toLocaleString('sv-SE', { hour12: false })}&R&8&K000000Sida &P av &N`,
        },
        views: [
            { state: 'frozen', xSplit: 0, ySplit: 2 },
        ],
        columns: [
            { key: 'name1' },
            { key: 'name2' },
        ],
    })

    worksheet.insertRow(1, [ settings.congregation.name ])
    worksheet.mergeCells('A1:C1')
    worksheet.insertRow(2, [ 'Namn' ])
    worksheet.mergeCells('A2:C2')
    worksheet.getRow(1).font      = { size: 24, bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }
    worksheet.getRow(2).font      = { bold: true }
    worksheet.getRow(2).border    = { bottom: { style: 'medium' } }


    for (let index = 0; index < columns[ 0 ].length; index++) {
        worksheet.insertRow((index+3), [
            columns[ 0 ][ index ] ? columns[ 0 ][ index ][ 0 ] : '',
            columns[ 1 ][ index ] ? columns[ 1 ][ index ][ 0 ] : '',
            columns[ 2 ][ index ] ? columns[ 2 ][ index ][ 0 ] : '',
        ])
    }

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

const savePdfFile = (name, docDefinition) => {
    let dialogOptions = {
        title       : 'Spara fil som ...',
        defaultPath : name,
        buttonLabel : 'Spara',
        filters     : [ {
            extensions: [ 'pdf' ],
        } ],
    }

    dialog.showSaveDialog(null, dialogOptions)
        .then((response) => {
            if(!response.canceled) {
                if(docDefinition){

                    pdfMake.tableLayouts = {
                        addressListLayout: {
                            hLineWidth: function (i, node) {
                              if (i === 0 || i === node.table.body.length) {
                                return 0
                              }
                              return (i === node.table.headerRows) ? 2 : 1
                            },
                            vLineWidth: function (i) {
                              return 0
                            },
                            hLineColor: function (i) {
                              return i === 1 ? 'black' : '#aaa'
                            },
                            paddingLeft: function (i) {
                              return i === 0 ? 0 : 2
                            },
                            paddingRight: function (i, node) {
                              return (i === node.table.widths.length - 1) ? 0 : 2
                            },
                          },
                    }

                    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
                    pdfDocGenerator.getBuffer((data) => {
                        fs.writeFileSync(response.filePath, data, (error) => {
                            if (err) {
                                log.error(error)
                            } else {
                                log.info('PDF Generated Successfully')
                            }
                        })
                    })
                }
            }
        })
        .catch(err => {
            log.error(err)
        })
}

const saveXlsxFile = (name, workbook) => {
    let dialogOptions = {
        title       : 'Spara fil som ...',
        defaultPath : name,
        buttonLabel : 'Spara',
        filters     : [ {
            extensions: [ 'xlsx', 'xls', 'xlsm', 'xlsb', 'xml', 'csv', 'ods', 'numbers' ],
        } ],
    }

    dialog.showSaveDialog(null, dialogOptions)
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

export const exportNameList = async (type) => {
    exportsService.upsert('export-name-list', type)
    const publishers = await publisherService.contacts()

    let name = `NameList_${new Date().toISOString().slice(0, 10)}`

    if(type === 'XLSX'){
        generateNameList_XLSX(publishers, name)
    }else{
        generateNameList_PDF(publishers, name)
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

    ipcMain.handle('generate-backup', async() => {
        backupDatabases()
    })

    /*** Task store */
    ipcMain.handle('statsTasks', async () => {
        return await tasksService.stats()
    })

    ipcMain.handle('getAllTasks', async (event, args) => {
        return await tasksService.findAll(args)
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
     * Warnings store
     */
    ipcMain.handle('getWarnings', async () => {
        const now    = new Date()
        let warnings = []
        const backup = await datesService.findByType('backup')

        if(backup){
            const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000
            const timeDiffInMs     = now.getTime() - backup.date.getTime()

            if(timeDiffInMs >= fourteenDaysInMs){
                backup.label = 'Det är dags att göra en ny backup'
                warnings.push(backup)
            }
        }else{
            warnings.push({ label: 'Det saknas en backup', type: 'backup', date: null, id: null })
        }

        return warnings
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

    ipcMain.handle('export-name-list', (event, args) => {
        exportNameList(args.type)
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

    ipcMain.on('seedDB', () => {
        maintenenceService.seed()
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

    const translateImport = (type) => {
        let value = ''
        switch(type){
            case 'pioneer':
                value = 'Pionjär'
                break
            case 'special_pioneer':
                value = 'Specialpionjär'
                break
            case 'aux_pioneer':
                value = 'Kontinuerlig hjälppionjär'
                break
            case 'elder':
                value = 'Äldste'
                break
            case 'ministerial_servant':
                value = 'Församlingstjänare'
                break
            case 'active':
                value = 'Regelbunden'
                break
            case 'irregular':
                value = 'Oregelbunden'
                break
            case 'inactive':
                value = 'Overksam'
                break
        }

        return value
    }

    ipcMain.on('import-old-secretary', async () => {
        const date        = new Date()
        const oldSettings = await settingsService.find()

        let options = {
            title       : 'Importera från Secretary',
            message     : 'OBS: All befintlig data kommer att ersättas om du fortsätter',
            buttonLabel : 'Importera',
            filters     : [
                { name: 'json', extensions: [ 'json' ] },
            ],
            properties: [ 'openFile' ],
        }

        dialog.showOpenDialog(null, options).then(result => {
            fs.readFile(result.filePaths[ 0 ], (err, data) => {
                if (!err) {
                    generateTemporaryBackup().then(async ()=>{
                        log.info('Start import old secretary')

                        let secretary                = JSON.parse(data.toString())
                        const newPublisherService    = new PublisherService()
                        const newServiceGroupService = new ServiceGroupService()
                        let phoneObj                 = secretary.phone ? parsePhoneNumberFromString(secretary.phone, 'SE') : null

                        // Import data
                        const settings = {
                            identifier   : uuidv4(),
                            congregation : {
                                name               : secretary.name,
                                number             : secretary.number,
                                co                 : secretary.co,
                                address            : secretary.address,
                                zip                : secretary.zip,
                                city               : secretary.city,
                                organizationNumber : secretary.org_no,
                                phone              : phoneObj ? {
                                    countryCallingCode : phoneObj.countryCallingCode,
                                    nationalNumber     : phoneObj.nationalNumber,
                                    number             : phoneObj.number,
                                    country            : phoneObj.country,
                                    countryCode        : phoneObj.countryCode,
                                    valid              : true,
                                    formatted          : phoneObj.format('NATIONAL'),
                                    type               : 'phone',
                                } : null,
                                email: secretary.email,
                            },
                            user: {
                                firstname : oldSettings.user.firstname,
                                lastname  : oldSettings.user.lastname,
                                email     : oldSettings.user.email,
                            },
                        }

                        await settingsService.update(oldSettings.id, settings)

                        if(secretary.groups){
                            secretary.groups.forEach(async group => {
                                if(!group.hidden){
                                    let serviceGroup = await newServiceGroupService.create({ name: group.name })

                                    // add contacts
                                    group.publishers.forEach( pub => {
                                        if(pub.contact){
                                            let appointments = []
                                            pub.appointments.map(appointment => {
                                                let type = {
                                                    type: {
                                                        name  : translateImport(appointment.type.toString()),
                                                        value : appointment.type.toString().toUpperCase(),
                                                    },
                                                    date: appointment.date,
                                                }
                                                appointments.push(type)
                                            })
                                            let children = []
                                            pub.children.map(child => {
                                                children.push({ firstName: child.firstname, birthday: child.birthday })
                                            })
                                            let status   = { name: translateImport(pub.status), value: pub.status.toString().toUpperCase() }
                                            let cellObj  = pub.cell ? parsePhoneNumberFromString(pub.cell, 'SE') : null
                                            let phoneObj = pub.phone ? parsePhoneNumberFromString(pub.phone, 'SE') : null

                                            let publisher = {
                                                s290            : pub.gdpr,
                                                registerCard    : pub.personalDataCard === 1 ? true : false,
                                                firstName       : pub.firstname,
                                                lastName        : pub.lastname,
                                                birthday        : pub.birthday,
                                                gender          : pub.gender === 'woman' ? 'female' : 'male',
                                                baptised        : pub.baptised,
                                                baptisedUnknown : pub.unknown_baptised,
                                                hope            : pub.hope,
                                                contactPerson   : pub.contact,
                                                contact         : null,
                                                address1        : pub.address,
                                                address2        : null,
                                                zip             : pub.zip,
                                                city            : pub.city,
                                                phone           : phoneObj ? {
                                                    countryCallingCode : phoneObj.countryCallingCode,
                                                    nationalNumber     : phoneObj.nationalNumber,
                                                    number             : phoneObj.number,
                                                    country            : phoneObj.country,
                                                    countryCode        : phoneObj.countryCode,
                                                    valid              : true,
                                                    formatted          : phoneObj.format('NATIONAL'),
                                                    type               : 'phone',
                                                } : null,
                                                cell: cellObj ? {
                                                    countryCallingCode : cellObj.countryCallingCode,
                                                    nationalNumber     : cellObj.nationalNumber,
                                                    number             : cellObj.number,
                                                    country            : cellObj.country,
                                                    countryCode        : cellObj.countryCode,
                                                    valid              : true,
                                                    formatted          : cellObj.format('NATIONAL'),
                                                    type               : 'cell',
                                                } : null,
                                                email          : pub.email,
                                                status         : status,
                                                information    : pub.information,
                                                emergencyName  : '',
                                                emergencyPhone : '',
                                                emergencyEmail : '',
                                                children       : children,
                                                appointments   : appointments,
                                                serviceGroup   : { name: serviceGroup.name, value: serviceGroup.id },
                                                tasks          : [],
                                            }

                                            newPublisherService.create(publisher).then(newPublisher => {
                                                group.publishers.forEach(async p => {
                                                    if(p.family_id === pub.id){
                                                        let appointments = []
                                                        p.appointments.map(appointment => {
                                                            let type = {
                                                                type: {
                                                                    name  : translateImport(appointment.type.toString()),
                                                                    value : appointment.type.toString().toUpperCase(),
                                                                },
                                                                date: appointment.date,
                                                            }
                                                            appointments.push(type)
                                                        })
                                                        let children = []
                                                        let status   = { name: translateImport(p.status), value: p.status.toString().toUpperCase() }
                                                        let cellObj  = p.cell ? parsePhoneNumberFromString(p.cell, 'SE') : null
                                                        let phoneObj = p.phone ? parsePhoneNumberFromString(p.phone, 'SE') : null

                                                        let publisher = {
                                                            s290            : p.gdpr,
                                                            registerCard    : p.personalDataCard === 1 ? true : false,
                                                            firstName       : p.firstname,
                                                            lastName        : p.lastname,
                                                            birthday        : p.birthday,
                                                            gender          : p.gender === 'woman' ? 'female' : 'man',
                                                            baptised        : p.baptised,
                                                            baptisedUnknown : p.unknown_baptised,
                                                            hope            : p.hope,
                                                            contactPerson   : p.contact,
                                                            contact         : { name: `${newPublisher.lastName}, ${newPublisher.firstName}`, value: newPublisher._id },
                                                            address1        : p.address,
                                                            address2        : null,
                                                            zip             : p.zip,
                                                            city            : p.city,
                                                            phone           : phoneObj ? {
                                                                countryCallingCode : phoneObj.countryCallingCode,
                                                                nationalNumber     : phoneObj.nationalNumber,
                                                                number             : phoneObj.number,
                                                                country            : phoneObj.country,
                                                                countryCode        : phoneObj.countryCode,
                                                                valid              : true,
                                                                formatted          : phoneObj.format('NATIONAL'),
                                                                type               : 'phone',
                                                            } : null,
                                                            cell: cellObj ? {
                                                                countryCallingCode : cellObj.countryCallingCode,
                                                                nationalNumber     : cellObj.nationalNumber,
                                                                number             : cellObj.number,
                                                                country            : cellObj.country,
                                                                countryCode        : cellObj.countryCode,
                                                                valid              : true,
                                                                formatted          : cellObj.format('NATIONAL'),
                                                                type               : 'cell',
                                                            } : null,
                                                            email          : p.email,
                                                            status         : status,
                                                            information    : p.information,
                                                            emergencyName  : '',
                                                            emergencyPhone : '',
                                                            emergencyEmail : '',
                                                            children       : children,
                                                            appointments   : appointments,
                                                            serviceGroup   : { name: serviceGroup.name, value: serviceGroup.id },
                                                        }
                                                        await newPublisherService.create(publisher)
                                                    }
                                                })
                                            })
                                        }
                                    })
                                }
                            })
                        }

                        datesService.upsert('import', date)
                        log.info('Done import old secretary')

                        return new Promise((resolve, reject) => {
                            setTimeout(() => resolve(result * 2), 3000)
                        })

                    }).then(() => {
                        removeTemporaryBackup()
                        return new Promise((resolve, reject) => {
                            setTimeout(() => resolve(result * 2), 1000)
                        })
                    }).then(() => {
                        const responseOptions = {
                            type      : 'info',
                            buttons   : [ 'OK' ],
                            defaultId : 0,
                            title     : 'Importen är klar',
                            message   : 'Importen av secretary är klar',
                            detail    : 'Applikationen kommer nu att avslutas och när du startar den nästa gång kommer den nya databasen att läsas in.',
                        }

                        dialog.showMessageBox(null, responseOptions).then(() => {
                            app.quit()
                        })
                    })
                }
            })
        })


    })

    const generateTemporaryBackup = async () => {
        const userDataPath = isDevelopment ? './db': app.getPath('userData') + '/db'

        return new Promise((resolve, reject) => {
            try {
                fs.readdir(userDataPath, (err, files) => {
                    if (err) { log.error(err)}

                    files.forEach(async file => {
                        if (file === '.DS_Store') { return}

                        await fs.copyFile(`${userDataPath}/${file}`, `${userDataPath}/backup_${file}`)
                    })
                })
                serviceGroupService.deleteAll()
                publisherService.deleteAll()

                log.info('Backup created')
                resolve('Backup created')
            } catch (err) {
                log.error(err)
                reject(new Error(err))
            }
        })

    }

    const removeTemporaryBackup = async () => {
        log.info('Remove temporary backup')
        const userDataPath = isDevelopment ? './db': app.getPath('userData') + '/db'

        try {
            fs.readdir(userDataPath, (err, files) => {
                if (err) { log.error(err)}

                files.forEach(async file => {
                    if (file === '.DS_Store') { return}

                    if(file.startsWith('backup_')){
                        await fs.remove(`${userDataPath}/${file}`)
                    }

                })
            })
        } catch (err) {
            log.error(err)
        }
        log.info('Temporary backup remove done')

        return 'done'
    }

    const restoreTemporaryBackup = async () => {
        log.info('Restore temporary backup')
        const userDataPath = isDevelopment ? './db': app.getPath('userData') + '/db'

        try {
            fs.readdir(userDataPath, (err, files) => {
                if (err) { log.error(err)}

                files.forEach(async file => {
                    if (file === '.DS_Store') { return}

                    if(!file.startsWith('backup_')){
                        await fs.remove(`${userDataPath}/${file}`)
                    }

                })
                files.forEach(async file => {
                    if (file === '.DS_Store') { return}

                    if(file.startsWith('backup_')){
                        await fs.rename(`${userDataPath}/${file}`, `${userDataPath}/${file.replace('backup_', '')}`)
                    }

                })
            })
        } catch (err) {
            log.error(err)
        }
        log.info('Restore backup done')

        return 'done'
    }

    /**
     * Internal main functions
     */
    const backupDatabases = () => {
        log.info('Backup start', new Date())

        const date         = new Date()
        const dateString   = date.toLocaleDateString('sv')
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
