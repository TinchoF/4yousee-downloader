// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron')
const AutoLaunch = require('auto-launch');
const path = require('path');

//let appIcon = null;
var autoLauncher = new AutoLaunch({
    name: 'Outcon',
    isHidden: true
});
autoLauncher.enable();
autoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
        return;
    }
    autoLauncher.enable();
})
.catch(function(err){
});

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icons/png/64x64.png'),
    width: 200,
    height: 100,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html');
  mainWindow.on('minimize',function(event){
      event.preventDefault();
      mainWindow.hide();
  });
  mainWindow.removeMenu()
  mainWindow.on('close', function (event) {
      if(!app.isQuiting){
          event.preventDefault();
          mainWindow.hide();
      }
      return false;
  });

////This section must be comment for Linux package/////////
  let contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function(){
        mainWindow.show();
    } },
    { label: 'Quit', click:  function(){
        app.isQuiting = true;
        app.quit();
    } }
  ]);
  appIcon = new Tray('outcon.ico');
  appIcon.setToolTip('Outcon');
  appIcon.setContextMenu(contextMenu);
  mainWindow.minimize()

///////////////////////////////////////////////////////////
}
app.disableHardwareAcceleration();
app.on('ready', createWindow);
