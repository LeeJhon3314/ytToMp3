const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let springProcess;

function createWindow () {
  const win = new BrowserWindow({
    width: 500,
    height: 350,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

function startSpringBootServer() {
  const jarPath = path.join(__dirname, 'api', 'yt-to-mp3-0.0.1-SNAPSHOT.jar');
  springProcess = spawn('java', ['-jar', jarPath], {
    cwd: __dirname,
    detached: true,
    stdio: 'ignore'
  });
  springProcess.unref();
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

app.whenReady().then(() => {
  startSpringBootServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (springProcess) springProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
