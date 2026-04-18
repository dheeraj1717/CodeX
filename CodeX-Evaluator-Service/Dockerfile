# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the service port
EXPOSE 4001

# Start the application
CMD ["node", "dist/index.js"]
