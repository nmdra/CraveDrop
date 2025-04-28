REGISTRY=nmdra

# Targets
.PHONY: port-forward-rabbitmq port-forward-postgres build-images print-build-images up-docker down-docker dashboard kustomize-view kustomize-apply

# Port forward RabbitMQ
port-forward-rabbitmq:
	kubectl port-forward svc/rabbitmq 15672:15672

# Build Docker image using buildx bake
build-images:
	export REGISTRY=$(REGISTRY) && docker buildx bake default

print-build-images:
	docker buildx bake --print

# Start Minikube dashboard and get the URL
dashboard:
	minikube dashboard --url

# Port forward Postgres
port-forward-postgres:
	kubectl port-forward svc/postgres-postgresql 5432:5432

# Docker Compose up with watch and build
up-docker:
	docker compose up --watch --build

down-docker:
	docker compose up --watch --build

# Apply kustomize with base configuration
kustomize-view:
	kubectl kustomize k8s/kustomization/base

kustomize-apply:
	kubectl apply -k k8s/kustomization/base