const { Spotilocal } = require('spotilocal')
const { app, globalShortcut, clipboard, Notification } = require('electron')

const spotilocal = new Spotilocal()

let spotifyInited = false,
    paused = false

app.on('ready', () => {
  const pauseShortcut = globalShortcut.register('Alt+Shift+1', () => { // available shortcuts https://electronjs.org/docs/api/accelerator
    if(!spotifyInited) return false
    spotilocal.pause(paused)
    paused = !paused
  })

  const playShortcut = globalShortcut.register('Alt+Shift+2', () => {
    if(!spotifyInited) return false

    const copiedText = clipboard.readText()
    if(!copiedText.includes('spotify:track:')) {
      console.log('here is no spotify URI in clipboard')
      return false
    }

    spotilocal.play(copiedText).catch(console.error)
  })

  if (!pauseShortcut) {
    console.log('pause/play shortcut registration failed')
  }

  if (!playShortcut) {
    console.log('play copied spotify URI shortcut registration failed')
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

console.log('Initing spotilocal')
spotilocal.init().then((spotilocal) => {
  spotifyInited = true
  console.log('Spolicocal inited')
}).catch(console.error)