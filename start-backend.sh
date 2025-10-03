#!/bin/bash

# Start Backend Server
echo "🚀 Starting NASA Exoplanet Detection Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt --quiet

echo "✅ Dependencies installed"
echo ""

# Create sample dataset
echo "📊 Creating sample NASA dataset..."
python utils/helpers.py

echo ""
echo "🎯 Backend server starting on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/api/docs"
echo ""
echo "⚠️  Keep this terminal open!"
echo "⚠️  Start frontend in a new terminal: npm run dev"
echo ""

# Start server
python main.py
