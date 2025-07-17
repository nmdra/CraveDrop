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
%%{init: {"theme": "default"}}%%
C4Container
title Food Delivery Platform - Container Diagram

Person(user, "User", "Orders food via web/mobile app")

Container_Boundary(client, "Client") {
    Container(frontend, "Frontend App", "React/JavaScript", "User interface for ordering and tracking")
}

Container_Boundary(gateway, "API Gateway") {
    Container(api_gw, "NGINX Gateway", "NGINX", "Routes API requests")
}

Container_Boundary(svc, "Services") {
    Container(user_svc, "User Service", "Node.js", "Authentication and User management")
    Container(order_svc, "Order Service", "Node.js", "Order placement and tracking")
    Container(rest_svc, "Restaurant Service", "Node.js", "Restaurant data and menus")
    Container(payment_svc, "Payment Service", "Node.js", "Payment processing")
    Container(notif_svc, "Notification Service", "Node.js", "Notification delivery")
    ContainerQueue(rabbit, "RabbitMQ", "AMQP", "Handles async events and jobs")
    Container(email, "Email Service", "SMTP", "Sends email notifications")
    Container(sms, "SMS Service", "SMS Gateway", "Delivers SMS notifications")
}

ContainerDb(user_db, "User DB", "PostgreSQL", "Stores users")
ContainerDb(order_db, "Order DB", "PostgreSQL", "Stores orders")
ContainerDb(rest_db, "Restaurant DB", "PostgreSQL", "Stores restaurants")
ContainerDb(payment_db, "Payment DB", "PostgreSQL", "Stores payments")
ContainerDb(notif_db, "Notification DB", "PostgreSQL", "Stores notification records")

Rel(user, frontend, "Uses", "HTTPS")
Rel(frontend, api_gw, "API requests", "HTTPS")

Rel(api_gw, user_svc, "Routes", "REST")
Rel(api_gw, order_svc, "Routes", "REST")
Rel(api_gw, rest_svc, "Routes", "REST")
Rel(api_gw, payment_svc, "Routes", "REST")
Rel(api_gw, notif_svc, "Routes", "REST")

Rel(user_svc, user_db, "Reads/Writes")
Rel(order_svc, order_db, "Reads/Writes")
Rel(rest_svc, rest_db, "Reads/Writes")
Rel(payment_svc, payment_db, "Reads/Writes")
Rel(notif_svc, notif_db, "Reads/Writes")

Rel(notif_svc, rabbit, "Publishes events", "AMQP")
Rel(email, rabbit, "Consumes email jobs", "AMQP")
Rel(sms, rabbit, "Consumes SMS jobs", "AMQP")
Rel(notif_svc, email, "Sends email")
Rel(notif_svc, sms, "Sends SMS")

%% ' Layout optimization for readability
UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="2")

%% ' Offset relationships to minimize overlap
UpdateRelStyle(api_gw, user_svc, $offsetX="-60", $offsetY="-35")
UpdateRelStyle(api_gw, order_svc, $offsetX="30", $offsetY="-35")
UpdateRelStyle(api_gw, rest_svc, $offsetX="-60", $offsetY="35")
UpdateRelStyle(api_gw, payment_svc, $offsetX="30", $offsetY="35")
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

