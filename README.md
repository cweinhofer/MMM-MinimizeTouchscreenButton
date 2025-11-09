# MMM-MinimizeTouchscreenButton

A simple module for MagicMirror² that adds a touchscreen button to minimize the application. This allows you to access the desktop or other applications running behind the mirror.

The button appears as a "minimize" icon (`fas fa-window-minimize`) and can be placed in any of the standard module positions.

## Installation

Installation for this module is a **two-part process**.

1. First, you install the module itself.

2. Second, you modify your MagicMirror² core files to allow the module to communicate with the main application window.

### Part 1: Install the Module

Navigate to your MagicMirror's `modules` directory and clone this repository.

```bash
cd ~/MagicMirror/modules
git clone https://github.com/cweinhofer/MMM-MinimizeTouchscreenButton.git
```

### Part 2: Modify MagicMirror² Core Files

This module requires a "bridge" to send the minimize signal to the main Electron application. This requires creating **one new file** and modifying **one existing file** in your MagicMirror's `js` folder.

**1. Create `js/preload.js`**

Create a new file named `preload.js` inside your `~/MagicMirror/js/` directory. Copy and paste the following contents into it. This file securely exposes the `minimize` function to the module.

```js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process 
// to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('MINIMIZE'),
});
```

**2. Modify `js/electron.js`**

Now, open your existing `~/MagicMirror/js/electron.js` file and make the following **three changes**:

(A) In the constants section near the top of the file, below `const electron = require("electron");` add the following which handles messages from the renderer process (the UI)

```js
const { ipcMain } = require("electron"); // Handles inter-process communication
```

(B) Inside the `createWindow` function, find the `webPreferences` object (around line 56). and modify it to enable `contextIsolation` and tell it to load the `preload.js` script you just created. Your `webPreferences` object should look like this:

```js
webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    zoomFactor: config.zoom,
    preload: require("path").join(__dirname, "preload.js") // Bridge for UI and main process
}
```
note: if you get a syntax error when you start your MagicMirror, you probably forgot to add the comma after `config.zoom` when adding the extra line

(C) At the end of the file, add the `ipcMain` listener. This listenes for the 'MINIMIZE' signal from the module and executes the minimize command.

```js
// --- Inter-Process Communication (IPC) Handlers ---

// Listen for the 'MINIMIZE' signal from the UI.
ipcMain.on('MINIMIZE', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});
```

**After saving both files, you must restart your MagicMirror** for the changes to take effect.

## Using the Module

To use this module, add it to the modules array in your `config/config.js` file.

```js
    {
        module: 'MMM-MinimizeTouchscreenButton',
        position: 'bottom_right' // Or any valid position string
    },
```

### Configuration Options

This module has no configuration options.

## Acknowledgements

The idea for this module was based on [MMM-SmartTouch](https://github.com/EbenKouao/MMM-SmartTouch/).

## License

Licensed under the MIT License. See the `LICENSE` file for details.
