# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the app (ESM-compatible)
CMD ["node", "index.js"]
