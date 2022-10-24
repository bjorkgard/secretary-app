export default {
    label   : 'Fönster',
    submenu : [
        {
            label       : 'Toggle Full Screen',
            accelerator : process.platform === 'darwin' ? 'Ctrl+Command+F' : 'Alt+Enter',
            click() {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
        },
        {
            label       : 'Minimize',
            accelerator : 'CmdOrCtrl+M',
            selector    : 'performMiniaturize:'
        },
    ]
}
