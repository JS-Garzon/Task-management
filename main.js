const { app, BrowserWindow } = require('electron');
// const { setMainMenu } = require('./menu');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 400,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    }
  });

  // win.loadFile('index.html');
  win.loadURL(`file://${path.join(__dirname, 'dist/task-management-app-frontend/browser/index.html')}`);

  // setMainMenu(win);
  win.setMenu(null);
};

app.whenReady().then(() => {
  createWindow();
});
