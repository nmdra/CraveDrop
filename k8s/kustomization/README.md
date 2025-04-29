# Deployment Guide

- [Deployment Guide](#deployment-guide)
  - [0. Directory Structute](#0-directory-structute)
  - [1. Environment Configuration](#1-environment-configuration)
  - [2. ConfigMap Generation](#2-configmap-generation)
  - [3. Deploy the Application](#3-deploy-the-application)
  - [4. PostgreSQL Installation (via Helm)](#4-postgresql-installation-via-helm)
    - [Step 1: Add Bitnami Repository](#step-1-add-bitnami-repository)
    - [Step 2: Install PostgreSQL](#step-2-install-postgresql)
    - [Step 3: Verify Installation](#step-3-verify-installation)
  - [5. Notes](#5-notes)

## 0. Directory Structute

```plaintext
.
├── base
│   ├── configs
│   │   ├── email-service.env
│   │   ├── notification-service.env
│   │   ├── order-service.env
│   │   ├── payment-service.env
│   │   ├── sms-service.env
│   │   └── user-service.env
│   ├── deployments
│   │   ├── email-service-deployment.yaml
│   │   ├── frontend-service-deployment.yaml
│   │   ├── notification-service-deployment.yaml
│   │   ├── order-service-deployment.yaml
│   │   ├── payment-service-deployment.yaml
│   │   ├── sms-service-deployment.yaml
│   │   └── user-service-deployment.yaml
│   ├── ingress
│   │   └── ingress.yaml
│   ├── kustomization.yaml
│   └── rabbitmq
│       └── rabbitmq.yaml
└── README.md
```

## 1. Environment Configuration

Before deploying, copy the environment files to the `configs/` directory and rename them properly if needed.

```bash
# Example
cp email-service/.env base/configs/email-service.env
cp notification-service/.env base/configs/notification-service.env
cp order-service/.env base/configs/order-service.env
cp payment-service/.env base/configs/payment-service.env
cp sms-service/.env base/configs/sms-service.env
cp user-service/.env base/configs/user-service.env
```

Make sure each service has the correct `.env` file placed inside `base/configs/`.

---

## 2. ConfigMap Generation

Kustomize automatically **generates ConfigMaps** from the files under `base/configs/` based on the `kustomization.yaml` configuration.  
You **do not need to manually create ConfigMaps** — they are created during `kubectl apply -k`.

> Learn more: [Kustomize ConfigMap Generation](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/configmapgenerator/)

Example snippet from `kustomization.yaml`:

```yaml
configMapGenerator:
  - name: user-service-config
    envs:
      - configs/user-service.env
  - name: email-service-config
    envs:
      - configs/email-service.env
  # (other services...)
```
---

## 3. Deploy the Application

Apply the full base configuration to your cluster:

```bash
kubectl apply -k k8s/base
```

This will deploy:
- Microservices (User, Order, Payment, Notification, Email, SMS)
- Frontend
- RabbitMQ
- Ingress

---

## 4. PostgreSQL Installation (via Helm)

Install **PostgreSQL** using the Bitnami Helm chart:

### Step 1: Add Bitnami Repository

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### Step 2: Install PostgreSQL

```bash
helm install postgres-release bitnami/postgresql \
  --set auth.username=youruser \
  --set auth.password=yourpassword \
  --set auth.database=yourdatabase
```

🔵 **Replace** `youruser`, `yourpassword`, and `yourdatabase` with your actual credentials.

You can also customize values further using a `values.yaml` file if needed.

### Step 3: Verify Installation

```bash
kubectl get pods
kubectl get svc
```

Make sure the PostgreSQL pod and service are running!

> Full chart documentation: [Bitnami PostgreSQL Helm Chart](https://artifacthub.io/packages/helm/bitnami/postgresql)

---

## 5. Notes

- Make sure RabbitMQ is running first if services depend on it.
- If needed, update `ingress/ingress.yaml` according to your domain or host settings.
- Make sure your Kubernetes cluster has an Ingress Controller (like NGINX) installed.




