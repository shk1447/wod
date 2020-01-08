const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1200, 
        height: 600,
        kiosk: false,
        fullscreen: false,
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