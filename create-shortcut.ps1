# PowerShell script to create desktop shortcut

$projectPath = $PSScriptRoot
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Ollama Screen.lnk"
$targetPath = Join-Path $projectPath "start-ollama-screen.bat"
$iconPath = Join-Path $projectPath "public\icons\lama.ico"

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell

# Create shortcut
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "Launch Ollama Screen Application"

# Set icon (Windows will use the PNG as icon)
if (Test-Path $iconPath) {
    $shortcut.IconLocation = $iconPath
}

# Save the shortcut
$shortcut.Save()

Write-Host "✅ Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "   Location: $shortcutPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now double-click the 'Ollama Screen' icon on your desktop to start the app!" -ForegroundColor Yellow
