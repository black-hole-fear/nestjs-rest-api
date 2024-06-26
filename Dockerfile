# Stage 1: Build the application
FROM node:16.9.0 as builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Print Node.js version for verification
RUN node --version

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the runtime image
FROM node:16.9.0-alpine

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Print Node.js version for verification
RUN node --version

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
