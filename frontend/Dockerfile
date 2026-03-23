FROM node:18-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies (fallback to install if ci has no lockfile)
RUN npm install

# Copy source code
COPY . .

# Pass API URL at build time so Next.js can bake it into static files
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application for production
RUN npm run build

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
