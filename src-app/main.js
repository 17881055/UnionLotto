'use strict';
const electron = require('electron');
const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const url = require('url');
const ipc = require('electron').ipcMain;
const nativeImage = require('electron').nativeImage;
const utils = require('./utils/ip.js');
const path = require('path');
const MESSAGE_TYPE = require('./message');
const mongo = require('./db');
const app = electron.app;
const dialog = electron.dialog;
const menu = electron.Menu;

let mainWindow;


function onClosed() {
	mainWindow = null;
}

const isDevelopment = (process.env.NODE_ENV || "development") === "development";
if (isDevelopment) {
	console.log("现在是 “ 调试模式 ” 开启 electron-reload");
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
	});
}

/* function execute(command, callback) {
	exec(command, function (error, stdout, stderr) {
		let contents = mainWindow.webContents;
		contents.send('message-log', null, error);
		callback(stdout, error, stderr);

	});
}; */

function createMainWindow() {
	var image = nativeImage.createFromPath('./assets/texture.png');
	const win = new electron.BrowserWindow({
		icon: image,
		backgroundColor: '#383535',
		resizable: false,
		width: 1200,
		height: 800,
		frame: true //无边框窗口
	});

	let indexPath = url.format({
		protocol: 'file:',
		pathname: path.join(__dirname, './view', 'index.html'),
		slashes: true
	});

	win.loadURL(indexPath);
	win.on('closed', onClosed);

	return win;
}


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	// 在主进程中.
	ipc.on('b2n_msg', function (event, type, message) {

		console.log("收到B端信息-要求是:", type);
		switch (type) {
			case MESSAGE_TYPE.IMPORT_DB:
				mongo.importToDB(message);
				break;
			case MESSAGE_TYPE.REQUEST_DATA:
				mongo.getData().then(
					(value) => {
						event.sender.send('n2b_msg', MESSAGE_TYPE.RESPONSE_DATA, JSON.stringify(value));
					}
				);
				break;
		}
	});
});
