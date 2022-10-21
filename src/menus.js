import {Menu, shell} from 'electron'

export function setupMenus(app,mainWindow){
    let menu
    let template;

    const help = {
        label   : 'Hjälp',
        submenu : [
            {
                type: 'separator'
            },
            {
                label: 'Dokumentation',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/wiki');
                }
            },
            {
                label: 'Rapportera fel / förslag',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/issues/new/choose');
                }
            },
            {
                label: 'Aktuella problem',
                click() {
                    shell.openExternal('https://github.com/bjorkgard/secretary-app/issues');
                }
            },
        ]
    }

    if (process.platform === 'darwin') {
        template = [
            {
                label   : 'Arkiv',
                submenu : [
                    {
                        label: 'Om Secretary',
                        click() {
                            //todo: show page in application
                            shell.openExternal('https://github.com/bjorkgard/secretary-app');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label       : 'Göm Secretary',
                        accelerator : 'Command+H',
                        click       : () => { app.hide(); }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label       : 'Avsluta',
                        accelerator : 'Command+Q',
                        click       : () => { app.quit(); }
                    },
                ]
            },
            {
                label   : 'Redigera',
                submenu : [
                    {
                        type: 'separator'
                    },
                    {
                        label       : 'Klipp ut',
                        accelerator : 'Command+X',
                        selector    : 'cut:'
                    }, {
                        label       : 'Kopiera',
                        accelerator : 'Command+C',
                        selector    : 'copy:'
                    }, {
                        label       : 'Klistra in',
                        accelerator : 'Command+V',
                        selector    : 'paste:'
                    }, {
                        label       : 'Markera allt',
                        accelerator : 'Command+A',
                        selector    : 'selectAll:'
                    }
                ]
            },
            {
                label   : 'Fönster',
                submenu : (process.env.NODE_ENV === 'development') ? [
                    {
                        label       : 'Toggle Full Screen',
                        accelerator : 'Ctrl+Command+F',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    },
                    {
                        label       : 'Minimize',
                        accelerator : 'Command+M',
                        selector    : 'performMiniaturize:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label       : 'Toggle Developer Tools',
                        accelerator : 'Alt+Command+I',
                        click() {
                            mainWindow.toggleDevTools();
                        }
                    },
                    {
                        label       : 'Clear database',
                        accelerator : 'Ctrl+Command+D',
                        click() {
                            console.log('delete db')
                        }
                    }
                ] : [
                    {
                        label       : 'Toggle Full Screen',
                        accelerator : 'Ctrl+Command+F',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    },
                    {
                        label       : 'Minimize',
                        accelerator : 'Command+M',
                        selector    : 'performMiniaturize:'
                    },
                ]
            }, help]

            menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
    } else {
        template = [{
            label   : '&File',
            submenu : [{
                label       : '&Open',
                accelerator : 'Ctrl+O'
            }, {
                label       : '&Close',
                accelerator : 'Ctrl+W',
                click() {
                    mainWindow.close();
                }
            }]
        }, {
            label   : '&View',
            submenu : (process.env.NODE_ENV === 'development') ? [{
                label       : '&Reload',
                accelerator : 'Ctrl+R',
                click() {
                    mainWindow.restart();
                }
            }, {
                label       : 'Toggle &Full Screen',
                accelerator : 'F11',
                click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            }, {
                label       : 'Toggle &Developer Tools',
                accelerator : 'Alt+Ctrl+I',
                click() {
                    mainWindow.toggleDevTools();
                }
            }] : [{
                label       : 'Toggle &Full Screen',
                accelerator : 'F11',
                click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            }, {
                type: 'separator'
            }, {
                label       : 'Toggle Developer Tools',
                accelerator : 'Alt+Command+I',
                click() {
                    mainWindow.toggleDevTools();
                }
            }]
        }, help];

        menu = Menu.buildFromTemplate(template);
        mainWindow.setMenu(menu);
    }
}
