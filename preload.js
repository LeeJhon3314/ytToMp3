const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('api', {
  fetchConvert: async (videoUrl, outputPath) => {
    const encodedUrl = encodeURIComponent(videoUrl);
    const encodedPath = encodeURIComponent(outputPath);
    const res = await fetch(`http://localhost:8080/api/convert?videoUrl=${encodedUrl}&outputPath=${encodedPath}`);
    if (!res.ok) throw new Error('轉換失敗');
    return '轉換請求已送出';
  },
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getDefaultDownloadPath: () => {
    return `${os.homedir()}/Downloads`;
  }
});
