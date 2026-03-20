FROM node:18-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies (fallback to install if ci has no lockfile)
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application for production
RUN npm run build

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
