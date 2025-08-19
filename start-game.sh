#!/bin/bash

# Resolve project root (directory where this script resides)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎯 Starting Secret Game servers..."
echo "==================================="

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

sleep 2

# Start backend in a subshell so current directory doesn't change
echo "🔧 Starting Backend server..."
(
  cd "$SCRIPT_DIR/backend" || exit 1
  # Install deps if needed
  if [ ! -d node_modules ]; then
    npm install
  fi
  npm run dev
) > "$SCRIPT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# Start frontend in a subshell
echo "🎨 Starting Frontend server..."
(
  cd "$SCRIPT_DIR/frontend" || exit 1
  if [ ! -d node_modules ]; then
    npm install
  fi
  npm start
) > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Wait for servers to warm up
sleep 10

echo ""
echo "🎮 Secret Game is ready!"
echo "========================"
echo ""
echo "🌐 Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "📊 Backend API:"
echo "   http://localhost:3001/api/status"
echo ""
echo "📋 To stop the servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🎂 Happy Birthday Rustin! Have fun at Golden Gate Park! 🏹"

# Wait for user to press Ctrl+C
echo "Press Ctrl+C to stop the servers..."
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait 