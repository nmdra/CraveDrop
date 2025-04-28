FROM node:22-alpine AS base

# Development image
FROM base AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add nodemon && yarn install --verbose

COPY ./src .

EXPOSE 3001

CMD ["yarn", "dev"]

# Production image

# Builder Stage
FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --verbose && yarn cache clean

COPY ./src .

FROM node:22-alpine AS production

LABEL org.opencontainers.image.title="sms-service"
LABEL org.opencontainers.image.description="CraveDrop SMS Service"
LABEL org.opencontainers.image.authors="Nimendra <nimendraonline@gmail.com>"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/nmdra/cravedrop"

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD [ "node", "index.js" ]