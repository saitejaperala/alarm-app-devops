#!/bin/bash

echo "🔨 Building Docker images..."

BUILD_NUMBER=${1:-"latest"}

# Build backend
echo "🐳 Building backend image..."
cd backend
docker build -t alarm-backend:${BUILD_NUMBER} .
docker tag alarm-backend:${BUILD_NUMBER} alarm-backend:latest
cd ..

# Build frontend
echo "🐳 Building frontend image..."
cd frontend
docker build -t alarm-frontend:${BUILD_NUMBER} .
docker tag alarm-frontend:${BUILD_NUMBER} alarm-frontend:latest
cd ..

echo "✅ Docker images built successfully!"
docker images | grep alarm
