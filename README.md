<a href="cravedrop.logo">
  <img src="https://github.com/user-attachments/assets/6d81d67d-0c6c-420d-abd9-593d4ac2a9c6" alt="Typing SVG" align="left" width="340" height="120" />
</a>

# **CraveDrop Delivery**
> ***Food ordering and delivery platform built with microservices architecture.***

---
[![Docker Build](https://img.shields.io/badge/docker-build-blue)](https://hub.docker.com/)
[![Kubernetes Ready](https://img.shields.io/badge/k8s-ready-blueviolet)](https://kubernetes.io/)
[![License](https://img.shields.io/github/license/your-username/cravedrop-delivery)](./LICENSE)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Messaging-orange)](https://www.rabbitmq.com/)

**CraveDrop** is a food ordering and delivery platform built with microservices architecture, enabling users to place orders, track deliveries, and interact with restaurants seamlessly.

- [CraveDrop Delivery](#cravedrop-delivery)
  - [Features](#features)
  - [Architecture](#architecture)
  - [CI/CD](#cicd)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [API Documentation](#api-documentation)

## Features

- **User Management**: User authentication and profile management
- **Order Management**: Place, track, and manage orders
- **Restaurant Management**: Browse and filter restaurants
- **Delivery Management**: Manage delivery service
- **Payment Integration**: Secure order payments
- **Real-time Notifications**: Email and SMS updates via RabbitMQ

## Architecture

- Microservices (Node.js, Go, etc.)
- RabbitMQ for messaging
- PostgreSQL for data storage
- Docker + Kubernetes for deployment
- API Gateway with NGINX

```mermaid
flowchart TD
  subgraph Client
    A[Frontend App]
  end

  subgraph Gateway
    B[NGINX API Gateway]
  end

  subgraph Services
    C[User Service]
    D[Order Service]
    E[Restaurant Service]
    F[Payment Service]
    G[Notification Service]
    H[Email Service]
    I[SMS Service]
  end

  subgraph Messaging
    J[RabbitMQ]
  end

  subgraph Database
    K[(PostgreSQL)]
  end

  A --> B
  B --> C
  B --> D
  B --> E
  B --> F
  B --> G
  C --> K
  D --> K
  E --> K
  F --> K
  G --> J
  H --> J
  I --> J
```

## CI/CD

We use **GitHub Actions** to automate building and pushing Docker images.

- **Trigger**: 
  - On **tag push** matching `v*.*.*` (e.g., `v1.0.0`)
  - Manual trigger via **workflow_dispatch**

- **Steps**:
  1. Checkout repository
  2. Log in to **GitHub Container Registry** (GHCR)
  3. Set up **Docker Buildx** and **QEMU** for multi-platform builds
  4. Use **docker-bake-action** to build and push images defined in `docker-bake.hcl`
  5. Images are tagged and pushed to `ghcr.io`

```yaml
on:
  tags:
    - 'v*.*.*'
  workflow_dispatch:
```

```bash
ghcr.io/<your-org-or-username>/<service-name>:<version>
```

> [!NOTE]
> - Images include Git commit SHA labels for traceability.
> - Build cache is enabled via GitHub Actions Cache (`type=gha`) for faster rebuilds.
> - Multi-platform support enabled with QEMU (`amd64`, `arm64`).

## Getting Started

### Prerequisites

- Docker
- Kubernetes (Minikube, Kind, or cloud)
- Kustomize (built into `kubectl` v1.14+)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cravedrop-delivery.git
   cd cravedrop-delivery
   ```

2. Build and run locally (optional):
   ```bash
   docker-compose up --build
   ```

3. Deploy to Kubernetes using **Kustomize**:
   ```bash
   kubectl apply -k k8s/kustomization/base
   ```

   > Adjust the path (`overlays/dev`) based on your environment (e.g., `prod`, `staging`).

## API Documentation

- Full API reference: [View on Postman](https://documenter.getpostman.com/view/33227780/2sB2ca8L6c)

## License

MIT License - see [LICENSE](LICENSE) for details.

