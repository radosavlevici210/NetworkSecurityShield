; Custom NSIS installer script for SecureGuard
; This script adds custom installation behavior

; Request administrator privileges
RequestExecutionLevel admin

; Custom pages and installation steps
!define MUI_FINISHPAGE_RUN "$INSTDIR\SecureGuard.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SecureGuard"

; Add firewall exception during installation
Section "Firewall Exception"
  ; Add Windows Firewall exception for SecureGuard
  ExecWait 'netsh advfirewall firewall add rule name="SecureGuard" dir=in action=allow program="$INSTDIR\SecureGuard.exe" enable=yes'
SectionEnd

; Create desktop shortcut with admin privileges
Section "Desktop Shortcut"
  CreateShortCut "$DESKTOP\SecureGuard.lnk" "$INSTDIR\SecureGuard.exe" "" "$INSTDIR\SecureGuard.exe" 0 SW_SHOWNORMAL ALT|CONTROL|SHIFT|F5 "SecureGuard - System Security Management"
SectionEnd