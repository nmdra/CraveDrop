FROM node:22-alpine AS base

# Development image
FROM base AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add nodemon && yarn install --verbose

COPY ./src .

# Expose port for development
EXPOSE 3001

# Start application in watch mode for development
CMD ["yarn", "dev"]

# Production image

# Builder Stage
FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --verbose && yarn cache clean

COPY ./src .

FROM cgr.dev/chainguard/node:latest AS production

LABEL org.opencontainers.image.title="restaurants-service"
LABEL org.opencontainers.image.description="CraveDrop Restaurants Service"
LABEL org.opencontainers.image.authors="Nimendra <nimendraonline@gmail.com>"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/nmdra/cravedrop"

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

