FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json from the backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY backend/ ./

# Copy the shared folder
COPY shared /app/shared

# Build the project (if needed)
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
