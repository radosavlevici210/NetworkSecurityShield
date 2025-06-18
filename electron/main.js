const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Set application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About SecureGuard',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About SecureGuard',
              message: 'SecureGuard v1.0.0',
              detail: 'Advanced System Security Management\nBuilt with Electron and React'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Start the backend server
  startServer();

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('http://localhost:5000');
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on the window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function startServer() {
  const serverPath = isDev 
    ? path.join(__dirname, '..', 'server', 'index.ts')
    : path.join(process.resourcesPath, 'app', 'dist', 'server.js');

  if (isDev) {
    serverProcess = spawn('npx', ['tsx', serverPath], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } else {
    serverProcess = spawn('node', [serverPath], {
      cwd: path.join(process.resourcesPath, 'app'),
      env: { ...process.env, NODE_ENV: 'production' }
    });
  }

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

// Windows system integration for security commands
ipcMain.handle('execute-security-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    // Ensure we're running with admin privileges
    const isAdmin = process.platform === 'win32' && process.env.USERPROFILE && process.env.USERPROFILE.includes('Administrator');
    
    if (!isAdmin && process.platform === 'win32') {
      reject(new Error('Administrator privileges required for security operations'));
      return;
    }

    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
});

// Execute the provided batch script
ipcMain.handle('execute-block-remote-script', async () => {
  const batchScript = `
@echo off
title Blocking Remote Connections - Admin Access Required

echo === Disabling Remote Desktop Access ===
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f

echo === Disabling Remote Services ===
sc config TermService start= disabled
sc stop TermService

sc config RemoteRegistry start= disabled
sc stop RemoteRegistry

sc config RasMan start= disabled
sc stop RasMan

echo === Blocking Common Remote Ports in Firewall ===
netsh advfirewall firewall add rule name="Block RDP TCP" dir=in action=block protocol=TCP localport=3389
netsh advfirewall firewall add rule name="Block RDP UDP" dir=in action=block protocol=UDP localport=3389
netsh advfirewall firewall add rule name="Block VNC" dir=in action=block protocol=TCP localport=5900
netsh advfirewall firewall add rule name="Block SSH" dir=in action=block protocol=TCP localport=22

echo === Enabling Windows Firewall ===
netsh advfirewall set allprofiles state on

echo.
echo Remote access blocked successfully.
echo Your PC is now protected against remote connection attempts.
`;

  return new Promise((resolve, reject) => {
    const tempFile = path.join(require('os').tmpdir(), 'block_remote_connections.bat');
    require('fs').writeFileSync(tempFile, batchScript);
    
    exec(`"${tempFile}"`, { shell: true }, (error, stdout, stderr) => {
      // Clean up temp file
      try {
        require('fs').unlinkSync(tempFile);
      } catch (e) {}
      
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
});

// System information gathering
ipcMain.handle('get-system-info', async () => {
  const commands = {
    win32: {
      firewall: 'netsh advfirewall show allprofiles state',
      services: 'sc query TermService & sc query RemoteRegistry & sc query RasMan',
      network: 'netstat -an | findstr :3389',
      security: 'wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName,productState'
    }
  };

  if (process.platform !== 'win32') {
    return { error: 'Windows-specific features only available on Windows' };
  }

  const results = {};
  for (const [key, command] of Object.entries(commands.win32)) {
    try {
      const result = await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve({ stdout, stderr });
        });
      });
      results[key] = result;
    } catch (error) {
      results[key] = { error: error.message };
    }
  }
  
  return results;
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});