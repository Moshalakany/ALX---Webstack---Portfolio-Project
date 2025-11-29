# Kubernetes Deployment Guide

## Prerequisites
- Kubernetes cluster configured and running
- kubectl installed and configured
- Docker installed

## Build Local Docker Images

```bash
# Build backend image
docker build -t backend-app:latest ./backend

# Build frontend image
docker build -t frontend-app:latest ./frontend

# For Minikube, load images into Minikube's Docker daemon:
# eval $(minikube docker-env)
# Then rebuild the images

# For Kind cluster, load images:
# kind load docker-image backend-app:latest
# kind load docker-image frontend-app:latest
```

## Deploy to Kubernetes

Apply the configurations in order:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secret
kubectl apply -f k8s/secret.yaml

# Create persistent volume claim
kubectl apply -f k8s/mongodb-pvc.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
```

## Verify Deployment

```bash
# Check all resources
kubectl get all -n chat-app

# Check pod status
kubectl get pods -n chat-app

# Check services
kubectl get svc -n chat-app
```

## Access the Application

```bash
# Get the frontend service external IP
kubectl get svc frontend -n chat-app

# For local clusters (minikube), use:
minikube service frontend -n chat-app
```

## Update Deployment

```bash
# Rebuild images
docker build -t backend-app:latest ./backend
docker build -t frontend-app:latest ./frontend

# For Minikube:
eval $(minikube docker-env)
docker build -t backend-app:latest ./backend
docker build -t frontend-app:latest ./frontend

# Restart deployments to pick up new images
kubectl rollout restart deployment/backend -n chat-app
kubectl rollout restart deployment/frontend -n chat-app
```

## Cleanup

```bash
kubectl delete namespace chat-app
```

## Troubleshooting

### Socket.IO Issues

If Socket.IO is not working:

1. **Rebuild frontend with updated nginx.conf:**
```bash
# Make sure you rebuild the frontend image after updating nginx.conf
docker build -t frontend-app:latest ./frontend

# For Minikube:
eval $(minikube docker-env)
docker build -t frontend-app:latest ./frontend
kubectl rollout restart deployment/frontend -n chat-app
```

2. **Check backend logs:**
```bash
kubectl logs -n chat-app -l app=backend --tail=100 -f
```

3. **Check frontend nginx logs:**
```bash
kubectl logs -n chat-app -l app=frontend --tail=100 -f
```

4. **Verify service endpoints:**
```bash
kubectl get endpoints -n chat-app
```

### Access Application

```bash
# For localhost LoadBalancer (Docker Desktop/Minikube with tunnel)
kubectl get svc frontend -n chat-app
# Access at http://localhost:3000 or the EXTERNAL-IP shown

# For Minikube specifically:
minikube service frontend -n chat-app --url
```
