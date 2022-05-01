const { app, BrowserWindow, ipcMain, IpcMessageEvent } = require("electron")
const url = require("url")
const path = require("path")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const { server } = require("./backend")
server()

let appWindow
function initWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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
}

app.on("ready", initWindow)

// Close when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", function () {
  if (win === null) {
    initWindow()
  }
})

ipcMain.on("db:add-task", (event, newTask) => {
  console.log("db:add-task", newTask)
  tasks.push(newTask)
  event.sender.send("db:task-added", tasks)
})
