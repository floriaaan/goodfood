# Payment Microservice

| Informations                                       |
| -------------------------------------------------- |
| **Port:** 50003                                    |
| **Developer:** @Anatole-Godard & @floriaaan        |
| **Status:** In progress                            |
| **Last update:** 2023-08-04                        |
| **Language:** NodeJS                               |
| **Dependencies:** TypeScript, gRPC, Postgres, AMQP |

## gRPC Methods

The service provides the following gRPC methods:

## Requirements

To run this microservice, you will need to have the following installed on your system:

- NodeJS (v18.12.0 or higher) (dev. with v18.12.0)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)

You can use the following tools to help you with the setup:

- You can use nvm to set your Node version using:
  - `nvm use`.
- You can use docker to run your Postgres database using:
  - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`
- You can use docker to run your RabbitMQ server using:
  - `docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:3-management`

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/payment`) in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (see `.env.example`).
5. Run `npm run start` to start the microservice.

You can now access the microservice at `http://localhost:50003`.

NB: If you want to run the microservice in development mode, you can run `npm run dev` instead.

## Testing

### Requests examples

**Install `grpcurl` on your machine.**
