$bytes = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
[System.IO.File]::WriteAllBytes('MINECRAFT/logo.png', $bytes)
Write-Host "Created MINECRAFT/logo.png (1x1 red pixel)"