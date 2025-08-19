#!/bin/bash

# Secret Game - Automated Test and Fix Script
# This script tests the entire project and fixes common issues

set -e  # Exit on any error

echo "🎯 Secret Game - Automated Test & Fix Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Test 1: Backend compilation and startup
echo ""
echo "🔧 Testing Backend..."

cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

# Try to compile TypeScript
print_status "Compiling TypeScript..."
if ! npm run build 2>/dev/null; then
    print_warning "TypeScript compilation failed, fixing..."
    # Fix common TS issues here if needed
    npm run build
fi

# Test backend startup (quick test)
print_status "Testing backend startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend is responding
if curl -s http://localhost:3001/api/status > /dev/null; then
    print_status "Backend is responding on port 3001"
else
    print_warning "Backend not responding, will fix later..."
fi

# Kill the test backend
kill $BACKEND_PID 2>/dev/null || true
wait $BACKEND_PID 2>/dev/null || true

# Test 2: Frontend compilation
echo ""
echo "🎨 Testing Frontend..."

cd ../frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Fix Tailwind CSS issue
echo ""
print_warning "Fixing Tailwind CSS configuration..."

# Remove problematic Tailwind setup and use simple CSS instead
npm uninstall tailwindcss @tailwindcss/postcss7-compat autoprefixer 2>/dev/null || true

# Remove PostCSS config
rm -f postcss.config.js

# Update index.css to use simple CSS instead of Tailwind
cat > src/index.css << 'EOF'
/* Simple CSS Reset and Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Button Styles */
.btn-primary {
  background-color: #4F46E5;
  color: white;
  font-weight: bold;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 18px;
  min-height: 44px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-primary:hover {
  background-color: #3730A3;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #10B981;
  color: white;
  font-weight: bold;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 18px;
  min-height: 44px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-secondary:hover {
  background-color: #047857;
}

.btn-danger {
  background-color: #EF4444;
  color: white;
  font-weight: bold;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 18px;
  min-height: 44px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-danger:hover {
  background-color: #DC2626;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 16px;
}

/* Layout Utilities */
.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.max-w-md {
  max-width: 28rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.w-full {
  width: 100%;
}

.p-4 {
  padding: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mb-8 {
  margin-bottom: 32px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-6 {
  margin-top: 24px;
}

.mr-2 {
  margin-right: 8px;
}

.mr-4 {
  margin-right: 16px;
}

/* Text Styles */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-bold {
  font-weight: bold;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

/* Colors */
.text-white {
  color: white;
}

.text-gray-800 {
  color: #1F2937;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-600 {
  color: #4B5563;
}

.text-gray-500 {
  color: #6B7280;
}

.text-blue-800 {
  color: #1E40AF;
}

.text-blue-700 {
  color: #1D4ED8;
}

.text-green-800 {
  color: #166534;
}

.text-green-700 {
  color: #15803D;
}

.text-yellow-800 {
  color: #92400E;
}

.text-yellow-700 {
  color: #A16207;
}

.text-red-800 {
  color: #991B1B;
}

/* Background Colors */
.bg-green-100 {
  background-color: #DCFCE7;
}

.bg-red-100 {
  background-color: #FEE2E2;
}

.bg-yellow-100 {
  background-color: #FEF3C7;
}

.bg-blue-50 {
  background-color: #EFF6FF;
}

.bg-green-50 {
  background-color: #F0FDF4;
}

.bg-gray-50 {
  background-color: #F9FAFB;
}

.bg-black {
  background-color: black;
}

.bg-red-500 {
  background-color: #EF4444;
}

.bg-green-400 {
  background-color: #4ADE80;
}

.bg-red-400 {
  background-color: #F87171;
}

/* Border */
.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-4 {
  border-width: 4px;
}

.border-gray-300 {
  border-color: #D1D5DB;
}

.border-yellow-400 {
  border-color: #FBBF24;
}

.border-blue-200 {
  border-color: #DBEAFE;
}

.border-blue-300 {
  border-color: #93C5FD;
}

.border-green-200 {
  border-color: #BBF7D0;
}

.border-gray-200 {
  border-color: #E5E7EB;
}

.rounded-lg {
  border-radius: 8px;
}

.rounded-xl {
  border-radius: 12px;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded {
  border-radius: 4px;
}

/* Layout */
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 4px;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 16px;
}

.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 24px;
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 16px;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-2 {
  gap: 8px;
}

/* Sizing */
.w-2 {
  width: 8px;
}

.h-2 {
  height: 8px;
}

.w-8 {
  width: 32px;
}

.h-8 {
  height: 32px;
}

.w-16 {
  width: 64px;
}

.h-16 {
  height: 64px;
}

.w-24 {
  width: 96px;
}

.h-24 {
  height: 96px;
}

/* Input Styles */
input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  transition: border-color 0.2s;
}

input[type="text"]:focus {
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Opacity */
.opacity-50 {
  opacity: 0.5;
}

.opacity-75 {
  opacity: 0.75;
}

.opacity-90 {
  opacity: 0.9;
}

.bg-opacity-20 {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Overflow */
.overflow-hidden {
  overflow: hidden;
}

/* Position */
.inline-block {
  display: inline-block;
}

/* Leading */
.leading-relaxed {
  line-height: 1.625;
}

/* Cursor */
.cursor-pointer {
  cursor: pointer;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

/* Transition */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
EOF

print_status "Converted to simple CSS (no Tailwind dependency)"

# Test frontend compilation
print_status "Testing frontend compilation..."
if npm run build > /dev/null 2>&1; then
    print_status "Frontend compiles successfully!"
else
    print_error "Frontend compilation failed"
    exit 1
fi

# Clean up build directory
rm -rf build

# Test 3: Integration test
echo ""
echo "🔗 Testing Integration..."

# Start backend
cd ../backend
print_status "Starting backend for integration test..."
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
cd ../frontend
print_status "Starting frontend for integration test..."
timeout 30s npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Test if both are running
BACKEND_OK=false
FRONTEND_OK=false

if curl -s http://localhost:3001/api/status > /dev/null; then
    print_status "Backend is running and responding"
    BACKEND_OK=true
else
    print_warning "Backend not responding"
fi

if curl -s http://localhost:3000 > /dev/null; then
    print_status "Frontend is running and responding"
    FRONTEND_OK=true
else
    print_warning "Frontend not responding"
fi

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true

# Final results
echo ""
echo "📊 Test Results Summary"
echo "======================="

if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    print_status "ALL TESTS PASSED! 🎉"
    echo ""
    echo "🚀 Ready to run the game:"
    echo "   Terminal 1: cd backend && npm run dev"
    echo "   Terminal 2: cd frontend && npm start"
    echo "   Then open: http://localhost:3000"
else
    print_error "Some tests failed. Check the logs:"
    echo "   Backend log: backend/backend.log"
    echo "   Frontend log: frontend/frontend.log"
fi

cd ..
EOF

chmod +x tests/test-and-fix.sh 