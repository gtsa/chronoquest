FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json from the frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY frontend/ ./

# Copy the shared folder
COPY shared /app/shared

# Build the project
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
