# Reporting Microservice

| Informations                                                  |
| ------------------------------------------------------------- |
| **Port:** 50020                                               |
| **Developer:** @floriaaan                                     |
| **Status:** In progress                                       |
| **Last update:** 2023-05-01                                   |
| **Language:** C# (dotnet 8)                                   |
| **Dependencies:** EF (entity framework), gRPC, RabbitMQClient |

## gRPC Methods

TBW

## Requirements

To run this microservice, you will need to have the following installed on your system:

- dotnet (dev. with dotnet version 8.0.100-preview.3.23178.7)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)
- RabbitMQ (v3.9.7 or higher) (dev. with docker image `rabbitmq:3.9.7-management`)

You can use the following tools to help you with the setup:

- You can use docker to run your Postgres database using:
  - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`
- You can use docker to run your RabbitMQ server using:
  - `docker run --name rabbitmq -p 5672:5672 -p 15672:15672 -d rabbitmq:3.9.7-management`

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/reporting`) in your terminal.

### 2. Setup the database

1. Run the following command to create the database:
   - `dotnet ef database update`

### 3. Run the service

1. Run the following command to start the service:
   - `dotnet run`

## Testing

### Requests examples

#### Pre-requisites

Install `grpcurl` on your machine.

1. Create a new report

```sh
grpcurl -d '{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }' \
    localhost:50020 com.goodfood.reporting.ReportingService.PushMetric
```

```json
{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }
```
