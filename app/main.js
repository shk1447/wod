const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        minWidth:1600,
        minHeight:900,
        width: 1600, 
        height: 900,
        kiosk: false,
        fullscreen: true,
        fullscreenable:false,
        resizable:false,
        frame:false
    });

    mainWindow.loadURL('file://' + __dirname + '/bundle/index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})