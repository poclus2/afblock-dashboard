# Stage 1: Build
FROM node:20-alpine AS builder

# Define build argument for API URL
ARG VITE_API_URL=https://api.afblock.dartsia.app

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build with the API URL as environment variable
RUN VITE_API_URL=$VITE_API_URL npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
