const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('native', {
  print: {
    getPrinters: () => {
      ipcRenderer.send('print.getPrinters');
    },
    order: (order, printer) => {
      ipcRenderer.send('print.order', order, printer);
    },
  },
});

ipcRenderer.on('getPrintersResponse', (_event, printers) => {
  window.postMessage(
    JSON.stringify({
      topic: 'getPrintersResponse',
      printers,
    })
  );
});
