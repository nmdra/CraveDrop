FROM node:22-alpine AS base

# Development image
FROM base AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port for development
EXPOSE 4000

# Start application in watch mode for development
CMD ["npm", "run", "dev"]


