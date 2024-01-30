FROM node:18-alpine3.17  as builder

# Set working directory
WORKDIR /app

# Copy the application code
COPY ./gateway/ .

# Install dependencies
RUN npm install

# Copy the proto files  
COPY ./proto ./proto/

# Generate the proto files
RUN npm run build:proto

# Build the application
RUN npm run build


# Create a new image with the application
FROM node:18-alpine3.17 as runner

# Set working directory
WORKDIR /app

# Copy the application package
COPY --from=builder /app/dist .
COPY --from=builder /app/proto/ /proto/

# Expose the gRPC port
EXPOSE 50000

# Expose the Webhook port
EXPOSE 4242

# Start the server
CMD [ "node", "index.js"]
