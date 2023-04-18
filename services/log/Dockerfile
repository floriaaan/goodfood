FROM arm64v8/golang:1.20-alpine as builder

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY ./log/go.mod ./log/go.sum ./
RUN go mod download

COPY ./log/*.go ./
COPY ./proto ./proto

RUN go build -o goodfood-log

FROM scratch as runner

# Copy binary from builder
COPY --from=builder /app/goodfood-log /usr/local/bin/goodfood-log

# Expose port
EXPOSE 50021

# Run
CMD ["goodfood-log"]