# SecureGuard - Advanced System Security Management

SecureGuard is a comprehensive security management application that provides centralized control over Windows system security settings, remote access management, firewall configuration, and real-time threat monitoring.

## Features

### 🛡️ Core Security Management
- **Remote Access Control**: Manage RDP, SSH, and VNC connections
- **Windows Firewall Management**: Configure domain, private, and public profiles
- **Service Management**: Control security-related Windows services
- **Activity Logging**: Comprehensive audit trail of all security actions

### 🖥️ Desktop Application
- **Native Windows App**: Downloadable .exe installer for Windows
- **Administrator Privileges**: Runs with elevated permissions for system modifications
- **System Integration**: Direct Windows API integration for real security changes
- **Offline Capable**: Works without internet connection

### 🌐 Web Interface
- **Modern UI**: React-based dashboard with real-time updates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Adaptive interface themes
- **Export Capabilities**: CSV export for activity logs

## Installation

### Desktop Application (Recommended for Windows)

1. **Download the installer**: Download `SecureGuard-Setup.exe` from the releases page
2. **Run as Administrator**: Right-click the installer and select "Run as administrator"
3. **Follow the installation wizard**: The installer will:
   - Install SecureGuard to your chosen directory
   - Create desktop and start menu shortcuts
   - Add Windows Firewall exceptions
   - Configure administrator privileges

### Web Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/secureguard.git
   cd secureguard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

4. **Access the dashboard**: Open http://localhost:5000 in your browser

## Building from Source

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Windows 10/11 (for desktop build)
- Administrator privileges

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Building Desktop Application
```bash
# Build web application first
npm run build

# Create Windows installer
npm run electron:build

# Create portable version
npm run electron:pack
```

The built installer will be available in the `dist-electron` directory.

## Usage

### Quick Start - Block All Remote Access
1. Launch SecureGuard (requires administrator privileges)
2. Navigate to the "Remote Access" tab
3. Click "Block All Remote Access" button
4. Confirm the action in the dialog

This will:
- Disable Remote Desktop Protocol (RDP)
- Stop SSH services
- Block VNC connections
- Enable Windows Firewall on all profiles
- Add firewall rules blocking common remote ports

### Managing Individual Services
- **Remote Access Tab**: Toggle individual protocols (RDP, SSH, VNC)
- **Firewall Tab**: Enable/disable firewall profiles independently
- **Services Tab**: Start, stop, enable, or disable Windows services
- **Activity Logs**: View detailed history of all security actions

### System Requirements
- **Windows 10/11**: Required for full functionality
- **Administrator Rights**: Necessary for system modifications
- **2GB RAM**: Minimum for smooth operation
- **50MB Disk Space**: For application installation

## Security Features

### Real-time Protection
- Monitors incoming connection attempts
- Blocks suspicious network activity
- Provides security scoring based on current configuration
- Alerts for critical security events

### Compliance
- Maintains detailed audit logs
- Exportable reports for compliance requirements
- Timestamp tracking for all security actions
- IP address logging for connection attempts

### Advanced Features
- **Threat Detection**: Identifies brute force attempts and port scans
- **Network Monitoring**: Real-time connection tracking
- **Policy Management**: Custom security rule sets
- **System Health**: CPU, memory, and network monitoring

## Configuration

### Default Security Settings
- All remote access protocols are **blocked** by default
- Windows Firewall is **enabled** on all profiles
- Remote services are **stopped** and **disabled**
- Activity logging is **enabled**

### Customization
All settings can be modified through the web interface or by editing the configuration files in the application directory.

## Troubleshooting

### Common Issues

**"Administrator privileges required"**
- Right-click SecureGuard and select "Run as administrator"
- Ensure UAC is enabled in Windows

**"Failed to apply security settings"**
- Check Windows Firewall service is running
- Verify no other security software is conflicting
- Run Windows Update to ensure system compatibility

**Application won't start**
- Check antivirus isn't blocking the application
- Ensure .NET Framework 4.8+ is installed
- Run Windows System File Checker: `sfc /scannow`

### Support
For technical support or bug reports, please create an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

SecureGuard modifies critical Windows security settings. Always test in a non-production environment first. The authors are not responsible for any system damage or security issues arising from the use of this software.