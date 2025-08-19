#!/bin/bash

echo "🎯 Secret Game - Verification Script"
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "🔍 Checking if servers are running..."

# Check backend
if curl -s http://localhost:3001/api/status > /dev/null 2>&1; then
    print_status "Backend is running on http://localhost:3001"
    echo "   Status: $(curl -s http://localhost:3001/api/status | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
else
    print_error "Backend is not responding on port 3001"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_status "Frontend is running on http://localhost:3000"
else
    print_error "Frontend is not responding on port 3000"
fi

echo ""
echo "🎮 Game URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001/api/status"
echo ""
echo "✨ Ready to play! Open http://localhost:3000 in your browser!" 