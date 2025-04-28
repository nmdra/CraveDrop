# docker-bake.hcl

# local override
# export REGISTRY=nmdra && docker buildx bake --print

# Define variables for customization
variable "REGISTRY" {
  default = "ghcr.io/nmdra"
}

variable "TAG" {
  default = "latest"
}

# Define common build configuration
target "common" {
  args = {
    BUILDKIT_INLINE_CACHE = "1"
  }
  labels = {
    "org.opencontainers.image.vendor" = "CraveDrop"
    "org.opencontainers.image.created" = "${timestamp()}"
    "org.opencontainers.image.source" = "https://github.com/nmdra/cravedrop"
    "org.opencontainers.image.authors" = "Nimendra"
    "org.opencontainers.image.licenses" = "MIT"
  }
}

# Default group builds all services with their specified targets from docker-compose
group "default" {
  targets = ["frontend", "user-service", "notification-service", "email-service", "sms-service", "order-service", "payment-service"]
}

# Frontend service
target "frontend" {
  inherits = ["common"]
  context = "./frontend"
  tags = ["${REGISTRY}/frontend:${TAG}"]
}

# User Service (default to development as in docker-compose)
target "user-service" {
  inherits = ["common"]
  context = "./user-service"
  target = "development"
  tags = ["${REGISTRY}/user-service:${TAG}"]
}

# Notification Service (default to production as in docker-compose)
target "notification-service" {
  inherits = ["common"]
  context = "./notification-service"
  target = "production"
  tags = ["${REGISTRY}/notification-service:${TAG}"]
}

# Email Service (default to production as in docker-compose)
target "email-service" {
  inherits = ["common"]
  context = "./email-service"
  target = "production"
  tags = ["${REGISTRY}/email-service:${TAG}"]
}

# SMS Service (default to production as in docker-compose)
target "sms-service" {
  inherits = ["common"]
  context = "./sms-service"
  target = "production"
  tags = ["${REGISTRY}/sms-service:${TAG}"]
}

# Order Service
target "order-service" {
  inherits = ["common"]
  context = "./order-service"
  target = "production"
  tags = ["${REGISTRY}/order-service:${TAG}"]
}

# Payment Service
target "payment-service" {
  inherits = ["common"]
  context = "./payment-service"
  target = "production"
  tags = ["${REGISTRY}/payment-service:${TAG}"]
}
