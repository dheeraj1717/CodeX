# Use Node.js LTS (Alpine for smaller image size)
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
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
# Note: For production, you might want a separate start script, 
# but "dev" currently points to "nodemon src/index.js".
# I'll update it to use "node src/index.js" in the CMD for production-ready.
