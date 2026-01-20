#!/bin/bash

# Setup script for Invoice Generator Test Suite

echo "================================================"
echo "NZ Tax Invoice Generator - Test Suite Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"
echo ""

echo "================================================"
echo "Setup complete! 🎉"
echo "================================================"
echo ""
echo "You can now run tests with:"
echo "  npm test                  - Run all tests"
echo "  npm run test:headed       - Run tests with browser visible"
echo "  npm run test:ui           - Run tests in interactive UI mode"
echo "  npm run test:debug        - Run tests in debug mode"
echo ""
echo "For more information, see README.md"
echo ""
