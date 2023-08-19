FROM golang:1.20-alpine as builder

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY ./user/go.mod ./user/go.sum ./
RUN go mod download

COPY ./user/main.go ./
COPY ./user/pkg ./pkg
COPY ./proto ./proto

RUN go build -o goodfood-user

FROM scratch as runner

# Copy binary from builder
COPY --from=builder /app/goodfood-user /usr/local/bin/goodfood-user
COPY ./user/config.yml ./user/dev.env ./
# Expose port
EXPOSE 50001

# Run
CMD ["goodfood-user"]