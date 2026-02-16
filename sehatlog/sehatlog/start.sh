#!/bin/bash

echo "🏥 Starting SehatLog - AI-Powered Healthcare Platform"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Install Python dependencies if needed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Python dependencies..."
    cd ai-service
    pip install -r requirements.txt
    cd ..
fi

# Seed database if first run
if [ ! -f "backend/.seeded" ]; then
    echo "🌱 Seeding database with sample data..."
    cd backend
    node seed.js
    touch .seeded
    cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting services..."
echo "=================================================="
echo ""
echo "🚀 Backend Server: http://localhost:3000"
echo "🤖 AI Service: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "📋 Demo Credentials:"
echo "   Admin: admin@sehatlog.com / Admin123"
echo "   Doctor: doctor@sehatlog.com / Doctor123"
echo "   Patient: P1001 / 9999999999"
echo ""
echo "=================================================="
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start AI service in background
cd ai-service
python3 ai_engine.py &
AI_PID=$!
cd ..

# Give AI service time to start
sleep 3

# Start backend (this will run in foreground)
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for services
wait $AI_PID $BACKEND_PID

# Cleanup on exit
trap "kill $AI_PID $BACKEND_PID 2>/dev/null" EXIT
