# Build and deploy for Docker Compose

Write-Host "Building images for Docker Compose..." -ForegroundColor Cyan

# Build backend
docker build -t chat-app-backend:latest ./backend

# Build frontend with Docker config
docker build -t chat-app-frontend:latest ./frontend

Write-Host "`nStarting Docker Compose..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "`nDocker Compose deployment complete!" -ForegroundColor Green
Write-Host "Access the app at: http://localhost:3000" -ForegroundColor Yellow
