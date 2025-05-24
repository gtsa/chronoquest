# Accept the build arg
ARG MODE=production
# or MODE=development
FROM node:18 as base
WORKDIR /app

# Copy and install deps
COPY frontend/package*.json ./
RUN npm install

# Copy source
COPY frontend/ ./
COPY shared /app/shared
COPY .env .env

# ---------- DEV Stage ----------
FROM base as development
EXPOSE 4173
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "4173"]

# ---------- PROD Stage ----------
FROM base as builder
RUN npm run build

FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---------- Final Stage Dispatcher ----------
FROM ${MODE} as final
