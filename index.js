const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')
const audio = require('win-audio').speaker
const mic = require('win-audio').mic
const mediaController = require('./media')
const express = require('express')

let paused = true
let win

app.on('ready', () => {
  win = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    focusable: false,
    opacity: 0.95,
    alwaysOnTop: true,
    transparent: true
  })
  win.setIgnoreMouseEvents(true)
  win.on('closed', () => {
    win = null
  })
  win.loadURL(`file://${__dirname}/index.html`)


  globalShortcut.register('Alt+Shift+1', () => {
    mediaController.executeCommand('previous', () => {})
  })

  globalShortcut.register('Alt+Shift+2', () => {
    if(paused) {
      mediaController.executeCommand('play', () => {})
    } else {
      mediaController.executeCommand('pause', () => {})
    }
    paused = !paused
  })

  globalShortcut.register('Alt+Shift+3', () => {
    mediaController.executeCommand('next', () => {})
  })

  globalShortcut.register('Alt+Shift+4', () => {
    actions.toggleMic()
  })

  globalShortcut.register('VolumeUp', () => {
    actions.increase()
  })
  globalShortcut.register('VolumeMute', () => {
    actions.toggleAudio()
  })
  
  globalShortcut.register('VolumeDown', () => {
    actions.decrease()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

const server = express()
server.get('/api/:method', (req, res) => {
  let returnInfo
  switch (req.params.method) {
    case 'previous':
      mediaController.executeCommand('previous', () => {})
      res.send({success: 'previous track'})
      break

    case 'pp': //play/pause
      if(paused) {
        mediaController.executeCommand('play', () => {})
      } else {
        mediaController.executeCommand('pause', () => {})
      }
      paused = !paused
      res.send({success: 'play/pause'})
      break

    case 'next':
      mediaController.executeCommand('next', () => {})
      res.send({success: 'next track'})
      break

    case 'increase':
      returnInfo = actions.increase()
      break

    case 'decrease':
      returnInfo = actions.decrease()
      break
    
    case 'toggleaudio':
      returnInfo = actions.toggleAudio()
      break
    case 'togglemic':
      returnInfo = actions.toggleMic()
      break
  
    default:
      res.send({error: 'method not found'})
      break
  }
  res.send(Object.assign({ success: true }, returnInfo))
})

const actions = {
  increase: () => {
    audio.increase(10)
    const data = getData()
    showInfo(data)
    return data
  },
  decrease: () => {
    audio.decrease(10)
    const data = getData()
    showInfo(data)
    return data
  },
  toggleAudio: () => {
    audio.toggle()
    const data = getData()
    showInfo(data)
    return data
  },
  toggleMic: () => {
    mic.toggle()
    const data = getData()
    showInfo(data, true)
    return data
  },
}

function getData() {
  return {
    volume: audio.get(),
    isAudioMuted: audio.isMuted(),
    isMicMuted: mic.isMuted()
  }
}

function showInfo (data, micToggled = false) {
  if (!win) return false
  if (!micToggled) delete data.isMicMuted
  win.webContents.send('info', data)
}

server.listen(3228, () => console.log('api started on port 3228'))