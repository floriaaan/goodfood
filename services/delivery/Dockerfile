FROM node:18-alpine  as builder

# Set working directory
WORKDIR /app

# Copy the application code
COPY ./delivery/ .

# Install dependencies
RUN npm install

# Copy the proto files - TODO: fix this, proto files should be copied from goodfood/services/proto 
COPY ./proto ./proto/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build


# Create a new image with the application
FROM node:18-alpine as runner

# Set working directory
WORKDIR /app

# Copy the application package
COPY --from=builder /app/dist .
COPY --from=builder /app/prisma/ .
COPY --from=builder /app/proto/ /proto/
COPY --from=builder /app/node_modules/.prisma/client /.prisma/client/

# Expose the gRPC port
EXPOSE 50008

# Start the server
CMD [ "node", "index.js"]
