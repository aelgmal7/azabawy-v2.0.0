const { app, BrowserWindow, ipcMain, IpcMessageEvent } = require("electron")
const url = require("url")
const path = require("path")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { executeCommand } = require("./helper-functions")

const {server} = require("./backend")
server()
let appWindow
function initWindow() {
  let appWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `frontend/dist/index.html`),
      protocol: "file:",
      slashes: true,
    })
  )
  // Initialize the DevTools.
  appWindow.webContents.openDevTools()
  appWindow.on("closed", function () {
    appWindow = null
  })

  return appWindow
}

// when app is ready, run the backend and init the window
app.on("ready", function () {
  executeCommand("npm run start:backend", (output) => {
    console.log(output)
  })
  appWindow = initWindow()
})

app.on("activate", function () {
  if (win === null) {
    appWindow = initWindow()
  }
})

// Close when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// before quitting the app, kill all node instances to close the backend
app.on("quit", function () {
  executeCommand("taskkill /f /im node.exe", (output) => {
    console.log(output)
  })
})

ipcMain.on("db:add-task", (event, newTask) => {
  console.log("db:add-task", newTask)
  tasks.push(newTask)
  event.sender.send("db:task-added", tasks)
})
