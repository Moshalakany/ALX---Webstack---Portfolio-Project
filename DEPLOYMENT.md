# Chat App Deployment Guide

This application supports two deployment methods: **Docker Compose** and **Kubernetes**.

## Architecture

The application consists of:
- **Frontend**: React app served by Nginx with Socket.IO support
- **Backend**: Node.js/Express server with Socket.IO
- **Database**: MongoDB

## Quick Start

### Docker Compose Deployment

For local development with Docker Compose:

```powershell
.\deploy-docker.ps1
```

Or manually:
```powershell
docker-compose up -d --build
```

Access at: **http://localhost:3000**

### Kubernetes Deployment

For production-like deployment with Kubernetes:

```powershell
.\deploy-k8s.ps1
```

Or manually:
```powershell
# Build images
docker build -t backend-app:latest ./backend
docker build -f ./frontend/Dockerfile.k8s -t frontend-app-k8s:latest ./frontend

# Apply manifests
kubectl apply -f ./k8s/namespace.yaml
kubectl apply -f ./k8s/secret.yaml
kubectl apply -f ./k8s/mongodb-pvc.yaml
kubectl apply -f ./k8s/mongodb-deployment.yaml
kubectl apply -f ./k8s/backend-deployment.yaml
kubectl apply -f ./k8s/frontend-deployment.yaml
```

Access via the LoadBalancer endpoint (e.g., **http://localhost:3000**)

## Key Differences Between Deployments

### Nginx Configuration

- **Docker Compose** uses `nginx.docker.conf`:
  - Backend URL: `http://backend:5000`
  - Uses Docker network DNS
  
- **Kubernetes** uses `nginx.k8s.conf`:
  - Backend URL: `http://backend.chat-app.svc.cluster.local:5000`
  - Uses Kubernetes service DNS

### Socket.IO Configuration

Both deployments use the same frontend code with dynamic origin detection:
- Connection: `window.location.origin`
- Path: `/socket.io/`

Backend accepts all origins (`origin: true`) for flexibility.

## File Structure

```
frontend/
├── Dockerfile              # Docker Compose build
├── Dockerfile.k8s          # Kubernetes build
├── nginx.docker.conf       # Docker Compose nginx config
└── nginx.k8s.conf          # Kubernetes nginx config

backend/
└── Dockerfile              # Same for both deployments

k8s/
├── namespace.yaml
├── secret.yaml
├── mongodb-pvc.yaml
├── mongodb-deployment.yaml
├── backend-deployment.yaml
└── frontend-deployment.yaml

deploy-docker.ps1           # Docker Compose deployment script
deploy-k8s.ps1              # Kubernetes deployment script
docker-compose.yml          # Docker Compose configuration
```

## Troubleshooting

### Docker Compose

Check container logs:
```powershell
docker logs chat-app-frontend
docker logs chat-app-backend
docker logs chat-app-mongodb
```

Restart services:
```powershell
docker-compose restart
```

### Kubernetes

Check pod status:
```powershell
kubectl get pods -n chat-app
```

Check logs:
```powershell
kubectl logs -n chat-app deployment/frontend
kubectl logs -n chat-app deployment/backend
kubectl logs -n chat-app deployment/mongodb
```

Restart deployment:
```powershell
kubectl rollout restart deployment/frontend -n chat-app
kubectl rollout restart deployment/backend -n chat-app
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGO_DB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Environment (production/development)

### Frontend
- Dynamically detects the backend URL through nginx proxy

## Switching Between Deployments

You can run both simultaneously as they use different images:
- Docker Compose: `chat-app-frontend:latest`, `chat-app-backend:latest`
- Kubernetes: `frontend-app-k8s:latest`, `backend-app:latest`

Just ensure port 3000 is not conflicting if both frontends try to use LoadBalancer.

## Notes

- Socket.IO requires sticky sessions (configured in both deployments)
- MongoDB data persists using volumes (Docker) or PVC (Kubernetes)
- CORS is configured to accept all origins for compatibility
