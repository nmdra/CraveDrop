# Step 1: Build the app with Vite using Yarn
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies using Yarn
COPY package.json yarn.lock ./

RUN yarn install

# Copy the rest of the project
COPY . .

# Build the app
RUN yarn build

# # Step 2: Serve the app with Nginx
# FROM nginx:alpine AS production

# # Copy built app from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Optional: Custom Nginx config for SPA routing
# COPY Nginx/nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM caddy:2.10.0-alpine

# Copy the Caddyfile
COPY ./Caddyfile /etc/caddy/Caddyfile

# Copy the static files from the builder
COPY --from=builder /app/dist /srv/

# Expose HTTP and HTTPS ports
EXPOSE 80