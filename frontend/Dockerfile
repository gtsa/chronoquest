# ---------- Declare arg for mode ----------
ARG MODE

# ---------- Base Stage ----------
FROM node:18 AS base
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
COPY shared /app/shared
COPY .env .env

# ---------- DEV Stage ----------
FROM base AS development
RUN echo "🏗️  Building DEVELOPMENT image"
EXPOSE 4173
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "4173"]

# ---------- PROD Stage ----------
FROM base AS builder
RUN echo "🏗️  Building PRODUCTION builder image" \
    && npm run build

FROM nginx:alpine AS production
RUN echo "🏗️  Building PRODUCTION final image"
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---------- Final Stage Dispatcher ----------
FROM ${MODE} AS final
ARG MODE
RUN echo "🏗️  Building FINAL image for mode: ${MODE}"    