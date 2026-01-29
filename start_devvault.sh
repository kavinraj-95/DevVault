#!/bin/bash

# Kill any existing processes on ports 8000 and 5173 to avoid conflicts
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

echo "🚀 Starting DevVault..."

# Start Backend
echo "📦 Starting Backend (FastAPI)..."
cd backend
# Use uv to run. If uv is not available, try python directly
if command -v uv &> /dev/null; then
    nohup uv run python run.py > backend.log 2>&1 &
else
    # Assuming venv is active or deps installed
    nohup python run.py > backend.log 2>&1 &
fi
BACKEND_PID=$!
echo "   Backend running (PID: $BACKEND_PID)"

# Start Frontend
echo "🎨 Starting Frontend (Vite)..."
cd ../frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend running (PID: $FRONTEND_PID)"

echo "✅ DevVault is running!"
echo "   👉 Frontend: http://localhost:5173"
echo "   👉 Backend: http://localhost:8000"
echo ""
echo "   (Logs are being written to backend/backend.log and frontend/frontend.log)"
