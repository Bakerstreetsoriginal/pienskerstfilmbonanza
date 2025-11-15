#!/bin/bash

# Deployment script for Kerstfilm Bonanza
# Usage: ./scripts/deploy.sh

set -e

echo "🎄 Deploying Pien's Kerstfilm Bonanza..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file from env.example"
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker compose -f docker-compose.prod.yml exec -T backend alembic upgrade head

# Seed genres
echo "🌱 Seeding genres..."
docker compose -f docker-compose.prod.yml exec -T backend python -m scripts.seed_genres

echo "✅ Deployment complete!"
echo "🌐 Application is running!"
echo ""
echo "Access the application at:"
echo "  - Frontend: http://your-domain.com"
echo "  - API: http://your-domain.com/api"
echo "  - API Docs: http://your-domain.com/docs"
echo ""
echo "Admin login: ${ADMIN_EMAIL}"

