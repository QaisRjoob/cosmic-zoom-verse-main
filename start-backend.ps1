# Start Backend Server
Write-Host "🚀 Starting NASA Exoplanet Detection Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment if it doesn't exist
if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt --quiet

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Create sample dataset
Write-Host "📊 Creating sample NASA dataset..." -ForegroundColor Yellow
python utils/helpers.py

Write-Host ""
Write-Host "🎯 Backend server starting on http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Documentation: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Keep this terminal open!" -ForegroundColor Yellow
Write-Host "⚠️  Start frontend in a new terminal: npm run dev" -ForegroundColor Yellow
Write-Host ""

# Start server
python main.py
