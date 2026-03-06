# PISA App - Start All Servers
# This script starts Firebase Emulator, Backend, and Frontend simultaneously

Write-Host "Starting PISA App (All Servers)..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Kill existing processes on all ports
Write-Host "Clearing ports 5000, 5173, 8080, 4400, 4401..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5000, 5001, 4400, 4401, 8080, 5173 -ErrorAction SilentlyContinue | 
  ForEach-Object { 
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue 
  }
Start-Sleep -Seconds 2

Write-Host "Ports cleared`n" -ForegroundColor Green

# Start Firebase Emulator in background
Write-Host "Starting Firebase Emulator on port 8080..." -ForegroundColor Cyan
$firebaseJob = Start-Job -ScriptBlock {
  cd "d:\Project CEDT"
  firebase emulators:start 2>&1
} -Name "firebase-emulator"

# Start Backend in background
Write-Host "Starting Backend on port 5000..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
  cd "d:\Project CEDT\backend\functions"
  npm run dev 2>&1
} -Name "backend-server"

# Start Frontend in background  
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
  cd "d:\Project CEDT\frontend"
  npm run dev 2>&1
} -Name "frontend-vite"

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "All servers started!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the app: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor White
Write-Host "  Firebase:  Get-Job -Name firebase-emulator | Receive-Job -Keep" -ForegroundColor Gray
Write-Host "  Backend:   Get-Job -Name backend-server | Receive-Job -Keep" -ForegroundColor Gray
Write-Host "  Frontend:  Get-Job -Name frontend-vite | Receive-Job -Keep" -ForegroundColor Gray
Write-Host ""
Write-Host "Stop all servers:" -ForegroundColor White
Write-Host "  Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host ""

# Keep showing status
while ($true) {
  $firebase = Get-Job -Name "firebase-emulator" -ErrorAction SilentlyContinue
  $backend = Get-Job -Name "backend-server" -ErrorAction SilentlyContinue
  $frontend = Get-Job -Name "frontend-vite" -ErrorAction SilentlyContinue
  
  if ($firebase.State -eq "Failed" -or $backend.State -eq "Failed" -or $frontend.State -eq "Failed") {
    Write-Host "WARNING: A server has failed!" -ForegroundColor Red
    Write-Host "Firebase: $($firebase.State)" -ForegroundColor Yellow
    Write-Host "Backend: $($backend.State)" -ForegroundColor Yellow
    Write-Host "Frontend: $($frontend.State)" -ForegroundColor Yellow
  }
  
  Start-Sleep -Seconds 10
}
