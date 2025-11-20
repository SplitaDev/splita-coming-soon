#!/bin/bash
# Start script for Splita backend server

echo "🚀 Starting Splita Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Creating .env from template..."
    cp .env.example .env 2>/dev/null || echo "   Please create .env file manually"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting server on port ${PORT:-3001}..."
npm start

