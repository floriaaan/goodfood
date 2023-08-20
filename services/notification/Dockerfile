FROM node:18-alpine3.17  as builder

# Set working directory
WORKDIR /app

# Copy the application code
COPY ./notification/ .

# Install dependencies
RUN npm install

# Copy the proto files  
COPY ./proto ./proto/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build


# Create a new image with the application
FROM node:18-alpine3.17 as runner

# Set working directory
WORKDIR /app

# Copy the application package
COPY --from=builder /app/dist .
COPY --from=builder /app/prisma/ .
COPY --from=builder /app/proto/ /proto/
COPY --from=builder /app/node_modules/.prisma /.prisma

# Expose the gRPC port
EXPOSE 50022

# Start the server
CMD [ "node", "index.js"]
