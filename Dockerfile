# Start from a Node base image
FROM node:18

# Create working directory
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
COPY ./frontend/package.json ./frontend/
COPY ./backend/package.json ./backend/
COPY package.json ./

# Install concurrently globally
RUN npm install -g concurrently

# Install dependencies for both frontend and backend
RUN npm install && npm install --prefix frontend && npm install --prefix backend

# Copy the application files
COPY . .

# Build the frontend application
RUN npm run build --prefix frontend

# Expose the ports for frontend and backend
EXPOSE 3000 3001

# Start both frontend and backend using concurrently
CMD ["concurrently", "npm:start --prefix frontend", "npm:start --prefix backend"]
