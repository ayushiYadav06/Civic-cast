# PowerShell script to find PHP configuration and check PDO MySQL setup

Write-Host "=== PHP Configuration Finder ===" -ForegroundColor Cyan
Write-Host ""

# Get PHP version
Write-Host "PHP Version:" -ForegroundColor Yellow
php -v
Write-Host ""

# Get php.ini location
Write-Host "PHP Configuration File:" -ForegroundColor Yellow
php --ini
Write-Host ""

# Get extension directory
Write-Host "Extension Directory:" -ForegroundColor Yellow
$extDir = php -r "echo ini_get('extension_dir');"
Write-Host $extDir
Write-Host ""

# Check if extension files exist
Write-Host "Checking Extension Files:" -ForegroundColor Yellow
$pdoMysql = Join-Path $extDir "php_pdo_mysql.dll"
$mysqli = Join-Path $extDir "php_mysqli.dll"

if (Test-Path $pdoMysql) {
    Write-Host "  ✓ php_pdo_mysql.dll found" -ForegroundColor Green
} else {
    Write-Host "  ✗ php_pdo_mysql.dll NOT found" -ForegroundColor Red
    Write-Host "    Expected at: $pdoMysql" -ForegroundColor Gray
}

if (Test-Path $mysqli) {
    Write-Host "  ✓ php_mysqli.dll found" -ForegroundColor Green
} else {
    Write-Host "  ✗ php_mysqli.dll NOT found" -ForegroundColor Red
    Write-Host "    Expected at: $mysqli" -ForegroundColor Gray
}

Write-Host ""

# Check loaded extensions
Write-Host "Loaded Extensions:" -ForegroundColor Yellow
$extensions = php -m
$pdoLoaded = $extensions | Select-String "pdo_mysql"
$mysqliLoaded = $extensions | Select-String "mysqli"

if ($pdoLoaded) {
    Write-Host "  ✓ pdo_mysql is LOADED" -ForegroundColor Green
} else {
    Write-Host "  ✗ pdo_mysql is NOT loaded" -ForegroundColor Red
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Yellow
    Write-Host "1. Open php.ini file (see path above)" -ForegroundColor White
    Write-Host "2. Search for: extension=pdo_mysql" -ForegroundColor White
    Write-Host "3. Remove the semicolon (;) at the beginning" -ForegroundColor White
    Write-Host "4. Save and restart PHP server" -ForegroundColor White
}

if ($mysqliLoaded) {
    Write-Host "  ✓ mysqli is LOADED" -ForegroundColor Green
} else {
    Write-Host "  ○ mysqli is not loaded (optional)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== End ===" -ForegroundColor Cyan
