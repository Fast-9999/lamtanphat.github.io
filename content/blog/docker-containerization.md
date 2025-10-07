---
title: "Docker - Containerization cho Developers"
date: 2025-07-22T10:00:00+07:00
draft: false
tags: ["Docker", "DevOps", "Containerization", "Deployment", "Microservices"]
categories: ["DevOps"]
description: "Tìm hiểu về Docker và cách sử dụng containers để phát triển và deploy ứng dụng hiệu quả"
featured: true
featured_image: "/images/docker-placeholder.jpg"
featured_badge: "Essential"
views: 1200
likes: 78
reading_time: 15
---

# Docker - Containerization cho Developers

Docker là một platform cho phép đóng gói ứng dụng và dependencies của nó vào trong một container nhẹ, portable. Nó giúp đảm bảo ứng dụng chạy nhất quán trên mọi môi trường từ development đến production.

## Tại sao cần Docker?

### 1. "It works on my machine" Problem
Docker giải quyết vấn đề ứng dụng chạy khác nhau giữa các môi trường.

### 2. Consistency
Đảm bảo ứng dụng chạy giống nhau trên mọi máy.

### 3. Isolation
Mỗi container chạy độc lập, không ảnh hưởng lẫn nhau.

### 4. Scalability
Dễ dàng scale ứng dụng bằng cách tạo thêm containers.

### 5. Resource Efficiency
Containers sử dụng ít tài nguyên hơn virtual machines.

## Docker vs Virtual Machines

| Docker Containers | Virtual Machines |
|-------------------|------------------|
| Chia sẻ OS kernel | Mỗi VM có OS riêng |
| Khởi động nhanh (giây) | Khởi động chậm (phút) |
| Sử dụng ít RAM | Sử dụng nhiều RAM |
| Lightweight | Heavyweight |
| Portable | Khó portable |

## Cài đặt Docker

### Windows
1. Tải Docker Desktop từ [docker.com](https://www.docker.com/products/docker-desktop)
2. Cài đặt và khởi động Docker Desktop
3. Kiểm tra: `docker --version`

### macOS
```bash
# Sử dụng Homebrew
brew install --cask docker

# Hoặc tải từ website
# https://www.docker.com/products/docker-desktop
```

### Linux (Ubuntu)
```bash
# Cập nhật package index
sudo apt-get update

# Cài đặt dependencies
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Thêm Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Thêm user vào docker group
sudo usermod -aG docker $USER
```

## Docker Basics

### Docker Images
Images là template để tạo containers.

```bash
# Pull image từ Docker Hub
docker pull nginx

# List images
docker images

# Remove image
docker rmi nginx
```

### Docker Containers
Containers là instances của images.

```bash
# Chạy container
docker run -d -p 8080:80 --name my-nginx nginx

# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop my-nginx

# Start container
docker start my-nginx

# Remove container
docker rm my-nginx

# Execute command trong running container
docker exec -it my-nginx bash
```

## Dockerfile

Dockerfile là script để build Docker images.

### Basic Dockerfile
```dockerfile
# Sử dụng base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Best Practices cho Dockerfile

```dockerfile
# 1. Sử dụng specific version tags
FROM node:18.16.0-alpine

# 2. Sử dụng non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 3. Optimize layer caching
COPY package*.json ./
RUN npm ci --only=production

# 4. Use .dockerignore
# node_modules
# npm-debug.log
# .git
# .gitignore
# README.md
# .env

# 5. Minimize layers
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 6. Use multi-stage builds
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

## Docker Compose

Docker Compose giúp định nghĩa và chạy multi-container applications.

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: bridge
```

### Docker Compose Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Build và start
docker-compose up --build

# Stop services
docker-compose down

# Stop và remove volumes
docker-compose down -v

# View logs
docker-compose logs -f web

# Execute command
docker-compose exec web bash

# Scale services
docker-compose up --scale web=3
```

## Docker Networks

```bash
# Create network
docker network create my-network

# Run container với custom network
docker run -d --name web --network my-network nginx

# Connect container to network
docker network connect my-network existing-container

# List networks
docker network ls

# Inspect network
docker network inspect my-network
```

## Docker Volumes

### Named Volumes
```bash
# Create volume
docker volume create my-volume

# Use volume
docker run -d --name web -v my-volume:/app/data nginx

# List volumes
docker volume ls

# Remove volume
docker volume rm my-volume
```

### Bind Mounts
```bash
# Mount host directory
docker run -d --name web -v /host/path:/container/path nginx

# Mount với Docker Compose
volumes:
  - ./src:/app/src
  - ./logs:/app/logs
```

## Docker trong Development

### Node.js Application
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]
```

### Java Spring Boot Application
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Python Flask Application
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
```

## Docker trong Production

### Security Best Practices
```dockerfile
# 1. Sử dụng non-root user
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 2. Scan images for vulnerabilities
# docker scan my-image

# 3. Use specific versions
FROM node:18.16.0-alpine

# 4. Remove unnecessary packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 5. Use secrets management
# docker run --secret source=mysecret,uid=1000 my-image
```

### Performance Optimization
```dockerfile
# 1. Use multi-stage builds
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]

# 2. Use .dockerignore
# node_modules
# .git
# *.log
# .env

# 3. Optimize layer caching
COPY package*.json ./
RUN npm install
COPY . .
```

## Docker với CI/CD

### GitHub Actions
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t my-app:${{ github.sha }} .
    
    - name: Run tests
      run: docker run --rm my-app:${{ github.sha }} npm test
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push my-app:${{ github.sha }}
```

### GitLab CI
```yaml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

build:
  stage: build
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE

test:
  stage: test
  script:
    - docker run --rm $DOCKER_IMAGE npm test

deploy:
  stage: deploy
  script:
    - docker run -d -p 80:3000 $DOCKER_IMAGE
```

## Monitoring và Logging

### Health Checks
```dockerfile
FROM nginx:alpine

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

COPY . /usr/share/nginx/html
```

### Logging
```bash
# View container logs
docker logs my-container

# Follow logs
docker logs -f my-container

# Logs with timestamps
docker logs -t my-container

# Last 100 lines
docker logs --tail 100 my-container
```

### Monitoring với Docker Stats
```bash
# Real-time stats
docker stats

# Stats for specific container
docker stats my-container

# One-time stats
docker stats --no-stream
```

## Docker Registry

### Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag my-app:latest username/my-app:latest

# Push image
docker push username/my-app:latest

# Pull image
docker pull username/my-app:latest
```

### Private Registry
```bash
# Run private registry
docker run -d -p 5000:5000 --name registry registry:2

# Tag for private registry
docker tag my-app:latest localhost:5000/my-app:latest

# Push to private registry
docker push localhost:5000/my-app:latest
```

## Troubleshooting

### Common Issues
```bash
# Container won't start
docker logs container-name

# Permission issues
docker run --user root my-image

# Port conflicts
docker run -p 8080:80 my-image

# Out of space
docker system prune -a

# Network issues
docker network ls
docker network inspect bridge
```

### Debugging
```bash
# Enter running container
docker exec -it container-name bash

# Inspect container
docker inspect container-name

# Check container processes
docker top container-name

# Monitor resource usage
docker stats container-name
```

## Best Practices

### 1. Keep Images Small
- Sử dụng Alpine Linux
- Multi-stage builds
- Remove unnecessary files

### 2. Security
- Non-root users
- Regular updates
- Scan for vulnerabilities

### 3. Performance
- Optimize layer caching
- Use .dockerignore
- Minimize layers

### 4. Development
- Use docker-compose
- Volume mounts for development
- Hot reload support

### 5. Production
- Health checks
- Resource limits
- Monitoring và logging

## Kết luận

Docker đã cách mạng hóa cách chúng ta phát triển và deploy ứng dụng:

- **Consistency**: Ứng dụng chạy giống nhau mọi nơi
- **Efficiency**: Sử dụng tài nguyên hiệu quả
- **Scalability**: Dễ dàng scale ứng dụng
- **Portability**: Deploy anywhere
- **Isolation**: An toàn và độc lập

Docker không chỉ là một tool, mà là một cách tiếp cận mới trong việc phát triển và vận hành ứng dụng.

## Tài liệu tham khảo

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)
