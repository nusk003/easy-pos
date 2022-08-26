const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const dayjs = require('dayjs');
const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  session,
  nativeTheme,
} = require('electron');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const url = require('url');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('App starting...');

function createWindow() {
  app.setLoginItemSettings({
    openAtLogin: app.isPackaged,
  });

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1280,
    minHeight: 720,
    title: 'Hotel Manager',
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    autoHideMenuBar: true,
    trafficLightPosition: { x: 16, y: 12 },
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'electron-preload.js'),
    },
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000';

  mainWindow.loadURL(appURL);

  mainWindow.webContents.addListener('crashed', () => {
    app.relaunch();
    app.quit();
  });

  nativeTheme.themeSource = 'light';

  session.defaultSession.webRequest.onHeadersReceived(
    {
      urls: [
        'https://api.hotelmanager.co/*',
        'https://stg.api.hotelmanager.co/*',
        'http://localhost:5000/*',
      ],
    },
    (details, callback) => {
      if (
        details.responseHeaders &&
        details.responseHeaders['set-cookie'] &&
        details.responseHeaders['set-cookie'].length &&
        !details.responseHeaders['set-cookie'][0].includes('SameSite=none')
      ) {
        details.responseHeaders['set-cookie'][0] +=
          '; SameSite=none; secure=true';
      }
      callback({ cancel: false, responseHeaders: details.responseHeaders });
    }
  );

  ipcMain.on('print.getPrinters', async (event) => {
    const printers = await mainWindow.webContents.getPrintersAsync();
    event.reply('getPrintersResponse', printers);
  });

  ipcMain.on('print.order', async (_event, order, printer) => {
    const hbsTemplate = fs.readFileSync(
      path.resolve(__dirname, 'print/templates/order.template.hbs'),
      'utf8'
    );

    const items = order.items.map((item) => {
      const options = item.modifiers?.flatMap((modifier) => {
        return modifier.options.map((option) => ({ name: option.name }));
      });

      return {
        name: item.name,
        options: options || [],
        quantity: item.quantity,
      };
    });

    const html = handlebars.compile(hbsTemplate)({
      orderReference: order.orderReference.toUpperCase(),
      dateCreated: dayjs(order.dateCreated).format('DD/MM/YY hh:mm:ss'),
      guest: {
        firstName: order.guest.firstName,
        lastName: order.guest.lastName,
      },
      deliveryType: !order.dateScheduled
        ? 'ASAP'
        : `Scheduled for ${dayjs(order.dateScheduled).format('MMM D HH:mm')}`,
      payment:
        order.paymentType === 'Cash'
          ? 'Pay in person'
          : order.paymentType === 'RoomBill'
          ? 'Add to room bill'
          : 'Paid by card',
      location: `${order.delivery} ${order.roomNumber}`,
      spaceName: order.space.name,
      pricelistName: order.pricelist.name,
      items,
      notes: order.notes,
    });

    const printWindow = new BrowserWindow({
      show: false,
    });

    await printWindow.loadURL(
      'data:text/html;charset=utf-8,' + encodeURIComponent(html)
    );

    printWindow.webContents.print(
      {
        silent: true,
        deviceName: printer.name,
        margins: {
          marginType: 'custom',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        pageSize: {
          width: 72 * 1000,
          height: 297 * 1000,
        },
      },
      () => {
        printWindow.close();
      }
    );
  });
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error('Failed to register protocol');
    }
  );
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const allowedNavigationDestinations = ['hotelmanager.co'];
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

if (app.isPackaged && process.platform === 'linux') {
  log.info('App can accept updates');

  app.on('ready', () => {
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60 * 1000);
  });

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });
}
