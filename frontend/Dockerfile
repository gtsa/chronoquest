FROM node:18

WORKDIR /app

# Copy package.json first for better caching
COPY frontend/package*.json ./

RUN npm install

# Copy the frontend source code
COPY frontend/ ./

# Copy shared folder
COPY shared /app/shared

# Expose your preferred port (4173)
EXPOSE 4173

# Start Vite in development mode with port 4173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"]
