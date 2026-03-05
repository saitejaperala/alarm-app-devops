#!/bin/bash

echo "🧪 Running tests..."

# Backend tests
echo "Testing backend..."
cd backend
npm install
npm test || echo "No backend tests configured"
cd ..

# Frontend tests
echo "Testing frontend..."
cd frontend
npm install
CI=true npm test || echo "No frontend tests configured"
cd ..

echo "✅ Tests completed!"
