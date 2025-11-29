# Build and deploy for Kubernetes

Write-Host "Building images for Kubernetes..." -ForegroundColor Cyan

# Build backend
docker build -t backend-app:latest ./backend

# Build frontend with Kubernetes config
docker build -f ./frontend/Dockerfile.k8s -t frontend-app-k8s:latest ./frontend

Write-Host "`nApplying Kubernetes manifests..." -ForegroundColor Cyan

# Apply in order
kubectl apply -f ./k8s/namespace.yaml
kubectl apply -f ./k8s/secret.yaml
kubectl apply -f ./k8s/mongodb-pvc.yaml
kubectl apply -f ./k8s/mongodb-deployment.yaml
kubectl apply -f ./k8s/backend-deployment.yaml
kubectl apply -f ./k8s/frontend-deployment.yaml

Write-Host "`nWaiting for deployments to be ready..." -ForegroundColor Cyan
kubectl rollout status deployment/mongodb -n chat-app
kubectl rollout status deployment/backend -n chat-app
kubectl rollout status deployment/frontend -n chat-app

Write-Host "`nKubernetes deployment complete!" -ForegroundColor Green
Write-Host "`nService status:" -ForegroundColor Yellow
kubectl get svc -n chat-app

Write-Host "`nAccess the app at the frontend service endpoint" -ForegroundColor Yellow
