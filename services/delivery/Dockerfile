FROM node:18-alpine  as builder

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the application code
COPY . .

# Copy the proto files - TODO: fix this, proto files should be copied from goodfood/services/proto 
# RUN cp -r -L ../proto /proto/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Package the application
RUN npm run pkg

# Create a new image with the application
FROM node:18-alpine as runner

# Set working directory
WORKDIR /app

# Copy the application package
COPY --from=builder /app/bin /usr/local/bin
RUN ls /usr/local/bin

# Expose the gRPC port
EXPOSE 50008

# Start the server
CMD ["delivery-linux-x64"]
