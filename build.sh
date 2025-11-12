#!/bin/bash
# Build script for Lovable deployment
set -e

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Build completed successfully!"
echo "Build output is in the 'dist' directory"

