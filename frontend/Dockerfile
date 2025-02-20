FROM node:18

WORKDIR /app

# Copy package.json first to optimize caching
COPY frontend/package*.json ./

RUN npm install

# Copy the frontend source code
COPY frontend/ ./

# Copy shared folder
COPY shared /app/shared

# 🚨 Fix: Delete old builds automatically on container start
RUN rm -rf dist node_modules/.vite

# Run Vite build before starting the server
RUN npm run build

EXPOSE 4173

CMD ["sh", "-c", "rm -rf dist node_modules/.vite && npm run build && npm run preview"]
