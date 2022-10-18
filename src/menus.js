import {Menu, shell} from 'electron'

export function setupMenus(app,mainWindow){
    let menu
    let template;

    const help = {
        label   : 'Hjälp',
        submenu : [{
            label: 'Dokumentation',
            click() {
                shell.openExternal('https://github.com/bjorkgard/secretary-app');
            }
        },
        {
            label: 'View Repository',
            click() {
                shell.openExternal('https://github.com/bjorkgard/secretary-app');
            }
        },
        {
            label: 'Search Issues',
            click() {
                shell.openExternal('https://github.com/bjorkgard/secretary-app/issues');
            }
        }]
    }

    if (process.platform === 'darwin') {
        template = [
            {
                label   : 'Edit',
                submenu : [{
                    type: 'separator'
                }, {
                    label       : 'Cut',
                    accelerator : 'Command+X',
                    selector    : 'cut:'
                }, {
                    label       : 'Copy',
                    accelerator : 'Command+C',
                    selector    : 'copy:'
                }, {
                    label       : 'Paste',
                    accelerator : 'Command+V',
                    selector    : 'paste:'
                }, {
                    label       : 'Select All',
                    accelerator : 'Command+A',
                    selector    : 'selectAll:'
                }]
            },
            {
                label   : 'Visa',
                submenu : (process.env.NODE_ENV === 'development') ? [
                    {
                        label       : 'Reload',
                        accelerator : 'Command+R',
                        click() {
                            mainWindow.restart();
                        }
                    },
                    {
                        label       : 'Toggle Full Screen',
                        accelerator : 'Ctrl+Command+F',
                        click() {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    },
                    {
                        label       : 'Toggle Developer Tools',
                        accelerator : 'Alt+Command+I',
                        click() {
                            mainWindow.toggleDevTools();
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
                        type: 'separator'
                    },
                    {
                        label       : 'Toggle Developer Tools',
                        accelerator : 'Alt+Command+I',
                        click() {
                            mainWindow.toggleDevTools();
                        }
                    }
                ]
            },
            {
                label   : 'Window',
                submenu : [{
                    label       : 'Minimize',
                    accelerator : 'Command+M',
                    selector    : 'performMiniaturize:'
                }, {
                    label       : 'Close',
                    accelerator : 'Command+W',
                    selector    : 'performClose:'
                }, {
                    type: 'separator'
                }, {
                    label    : 'Bring All to Front',
                    selector : 'arrangeInFront:'
                }]
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
