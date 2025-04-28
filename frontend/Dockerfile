FROM node:22-alpine AS builder

ARG STRIPE_SECRET_KEY
ARG VITE_MAPBOX_API_KEY

ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV VITE_MAPBOX_API_KEY=${VITE_MAPBOX_API_KEY}}

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM caddy:2.10.0-alpine

# Copy the Caddyfile
COPY ./Caddyfile /etc/caddy/Caddyfile

COPY --from=builder /app/dist /srv/

EXPOSE 80