export default {
    label   : 'Fönster',
    role    : 'window',
    submenu : [
        {
            label       : 'Minimera',
            accelerator : 'CmdOrCtrl+M',
            selector    : 'performMiniaturize:',
        },
        { label: 'Faktisk storlek', role: 'resetZoom' },
        { label: 'Zooma in', role: 'zoomIn' },
        { label: 'Zooma ut', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Växla helskärmsläge', role: 'toggleFullScreen' },
    ],
}
