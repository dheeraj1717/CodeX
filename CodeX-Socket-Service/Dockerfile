# Use Node.js LTS (Alpine)
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose the service port
EXPOSE 4005

# Start the application
CMD ["node", "src/server.js"]
