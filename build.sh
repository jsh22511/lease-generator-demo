#!/bin/bash

echo "🏠 Building Lease Generator for Production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Static files generated in ./out directory"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi
