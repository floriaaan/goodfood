# Log Microservice

| Informations                       |
| ---------------------------------- |
| **Port:** 50021                    |
| **Developer:** @floriaaan          |
| **Status:** In progress            |
| **Last update:** 2023-04-18        |
| **Language:** Go                   |
| **Dependencies:** gRPC, Gorm, AMQP |

## gRPC Methods

The service provides the following gRPC methods:

- `CreateLog`: Creates a new log message.
- `GetLog`: Retrieves a log message by its ID.
- `ListLog`: Retrieves a list of all log messages.

## Requirements

To run this microservice, you will need to have the following installed on your system:

- Go (dev. with go version go1.20.2 darwin/arm64)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)
- RabbitMQ (dev. with docker image `rabbitmq:3-management`)

You can use the following tools to help you with the setup:

- You can use docker to run your Postgres database using:
  - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`
- You can use docker to run your RabbitMQ server using:
  - `docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:3-management`

## Getting started



### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/log`) in your terminal.
3. Install the dependencies using `go mod download`.
4. Create a `.env` file at the root of the project directory and add the environment variables values (
   see `.env.example`).
5. Build the service using `go build .`.
6. Run the service using `./log`.

You can now access the microservice at `http://localhost:50021`.

NB: If you want to run the microservice in development mode, you can run `go run .` instead.

If protos are updated, you will need to regenerate the gRPC code using the following command:
`protoc -I . log.proto  --go-grpc_out=. --go_out=.`

### 2. Build and run the service using Docker

Watch out for the following:

- The build context is the `goodfood/services` folder.
- The Dockerfile `FROM image` is using an arm64 image. If you are using a different architecture, you
  will need to change the image to a compatible one.
- The docker container is requiring `postgres` container to be running. You can use the following
  command to run the container:
  `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`
- The docker container is requiring `rabbitmq` container to be running. You can use the following
  command to run the container:
  `docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:3-management`

1. Build the Docker image from `goodfood/services` folder using:
   `docker build -t goodfood-log:1.0.0 -f log/Dockerfile .`
2. Run the Docker container using:
   `docker run --name goodfood-log -p 50021:50021 --env-file log/.env  goodfood-log:1.0.0`
