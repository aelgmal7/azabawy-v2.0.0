const { app, BrowserWindow, ipcMain, IpcMessageEvent } = require("electron");
const url = require("url");
const path = require("path");
const express = require("express");
const cors = require('cors')
const bodyParser =require('body-parser')

const exp = express();
exp.use(express.json());
exp.use(bodyParser.urlencoded({extended:false}))


exp.use(cors());
const tasks =['ahm3d','aaa']

exp.use('/a',(req,res,next) => {
  res.send(`{
    "name": "samy",
    "age": 48,
    "location": "tanta",
    "physicalStatus": "3bit",
    "mentalStatus": "mt5lf",
    "photo": "https://i.ytimg.com/vi/N8WPmAvZNns/hqdefault.jpg"
}`)
})
exp.get('/tasks',(req,res,next) => {
  res.send(tasks)
})
exp.post('/tasks',(req,res,next) => {
  const r= req.body.title
  console.log(r)
  tasks.push(r)
  res.send(`{"title":"${tasks}"}`)
})
exp.listen(500)
// const { app, BrowserWindow,  } from "electron";

let appWindow;
function initWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  // Initialize the DevTools.
  appWindow.webContents.openDevTools();
  appWindow.on("closed", function () {
    appWindow = null;
  });
}

app.on("ready", initWindow);

// Close when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (win === null) {
    initWindow();
  }
});

ipcMain.on("db:add-task", (event, newTask) => {
  console.log("db:add-task", newTask);
  tasks.push(newTask);
  event.sender.send("db:task-added", tasks);
});
