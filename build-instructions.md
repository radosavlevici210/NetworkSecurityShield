# SecureGuard Windows Application Build Instructions

## Building the Desktop Application for Windows

### Prerequisites
- Windows 10/11 development machine
- Node.js 18+ installed
- Administrator privileges
- Visual Studio Build Tools (for native modules)

### Step 1: Prepare the Build Environment
```bash
# Install build dependencies
npm install -g windows-build-tools

# Clone and setup the project
git clone <repository-url>
cd secureguard
npm install
```

### Step 2: Build the Web Application
```bash
# Build the frontend and backend
npm run build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend server bundle

### Step 3: Build the Electron Application
```bash
# Create Windows installer
npm run electron:build
```

This will create in `dist-electron/`:
- `SecureGuard Setup 1.0.0.exe` - Windows installer
- `SecureGuard-1.0.0-win.zip` - Portable version

### Step 4: Test the Application
```bash
# Test in development mode
npm run electron:dev

# Test the built installer
./dist-electron/SecureGuard\ Setup\ 1.0.0.exe
```

## Distribution Package Contents

The Windows installer includes:
1. **Main Application**: SecureGuard.exe with embedded Node.js runtime
2. **Dependencies**: All required Node.js modules bundled
3. **Assets**: Application icons and resources
4. **Security Scripts**: Windows batch files for system operations
5. **Documentation**: README and usage instructions

## Windows Integration Features

### Administrator Privileges
The application automatically requests administrator privileges through:
- UAC elevation prompt on startup
- Embedded manifest requiring administrator execution level
- Registry modifications for Windows security settings

### System Integration
- Windows Firewall API integration
- Windows Services control
- Registry access for security settings
- Batch script execution for complex operations

### Security Features
- Code signing (configure with your certificate)
- Antivirus compatibility testing
- Windows Defender exclusions setup
- Safe application uninstall process

## Deployment Options

### Option 1: Direct Download
Upload the installer to your website/GitHub releases:
- Users download `SecureGuard Setup 1.0.0.exe`
- Run installer as administrator
- Application auto-updates through built-in updater

### Option 2: Microsoft Store (Future)
Package as MSIX for Microsoft Store distribution:
```bash
# Additional build for Store
npm run electron:build -- --win --publish never
electron-builder --win appx
```

### Option 3: Enterprise Deployment
For corporate environments:
- MSI installer creation
- Group Policy deployment
- Silent installation options
- Centralized configuration management

## Building Advanced Features

### Real Windows System Integration
The application integrates with Windows through:

1. **Registry Access**:
   - `HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server`
   - Windows Firewall settings
   - Service configuration keys

2. **Windows Services**:
   - Terminal Services (TermService)
   - Remote Registry (RemoteRegistry)
   - Remote Access Manager (RasMan)

3. **Firewall Commands**:
   - `netsh advfirewall` for firewall management
   - Port blocking and allowing
   - Profile-specific configurations

4. **System Commands**:
   - `sc` for service control
   - `reg` for registry operations
   - `wmic` for system information

## Security Considerations

### Code Signing
For production deployment, sign the executable:
```bash
# Install signing certificate
# Configure electron-builder with certificate details
```

### Antivirus Compatibility
Test with major antivirus solutions:
- Windows Defender
- Norton
- McAfee
- Kaspersky
- Bitdefender

### Windows Compatibility
Tested on:
- Windows 10 (1903+)
- Windows 11 (all versions)
- Windows Server 2019/2022

## Troubleshooting Build Issues

### Common Problems

**"Native module build failed"**
```bash
npm install --global windows-build-tools
npm rebuild
```

**"Permission denied during build"**
- Run Command Prompt as Administrator
- Disable antivirus temporarily during build

**"Electron rebuild errors"**
```bash
npx electron-rebuild
```

### Build Optimization
- Minimize bundle size by excluding dev dependencies
- Compress assets for faster download
- Enable incremental builds for faster development

The built application provides a complete Windows security management solution that can be distributed to end users as a standalone installer.