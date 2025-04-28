FROM node:22-alpine AS builder

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