# spotify-shortcuts
Provides "Pause/Play" and "play copied Spotify-URI" shortcuts for Spotify Desktop on Windows.
## How it works
Just run this application (from command line or already builded exe file) and after couple seconds the app has been ready.
## Let's start
```
git clone https://github.com/seniv/spotify-shortcuts.git
cd spotify-shortcuts
npm install
npm start
```
## Default shortcuts
`Alt+Shift+1` - Pause/Play

`Alt+Shift+2` - play copied Spotify-URI
## What is "play copied Spotify-URI"?
You can get URI of each track on spotify (for example from friend) and if you have this URI in clipboard - you can start playing this track by using shortcut
## build "exe" file
```
npm run build
```
## Change shortcuts
If you wanna change shortcuts you need to modify `index.js` file
## Launch on windows startup
Make shortcut of exe file (if you already builded the app) and put it to `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
## Why?
Because i don't have "play/pause" key on keyboard and on windows i can't set shortcut for this (hello Microsoft)