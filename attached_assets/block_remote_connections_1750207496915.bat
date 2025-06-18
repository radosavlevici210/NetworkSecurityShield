@echo off
title Blocking Remote Connections - Admin Access Required

echo === Disabling Remote Desktop Access ===
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f

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
echo ✅ Remote access blocked successfully.
echo 🔒 Your PC is now protected against remote connection attempts.
pause
