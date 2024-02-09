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

## Documentation

### Codes, types

| Code                       | Interval             | Type                       | Service        | Description                       |
| -------------------------- | -------------------- |----------------------------| -------------- | --------------------------------- |
| incomes\_<interval>        | 1d \| 1w \| 1m \| 1y | number                     | Order, payment | Sum of order total prices         |
| outcomes\_<interval>       | 1d \| 1w \| 1m \| 1y | number                     | Stock          | Sum of restock prices             |
| top5_selling\_<interval>   | 1w \| 1m             | string[] (product.id)      | Order          | Top 5 selling products            |
| affluence\_<interval>      | 1d                   | number[]                   | Order          | Number of orders by hour          |
| delivery_types\_<interval> | 1d                   | string (delivery;takeaway) | Order          | Number of orders by delivery type |
| rejection_rate\_<interval> | 1d                   | number                     | Notification   | Rate of rejected orders           |

## Testing

### Requests examples

**Install `grpcurl` on your machine.**

<!-- 1. Create a new report

```sh
grpcurl -d '{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }' \
    localhost:50020 com.goodfood.reporting.ReportingService.PushMetric
```

```json
{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }
``` -->

- GetMetric: `grpcurl -d '{"key": "example_key"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetric`

- GetMetricsByRestaurant: `grpcurl -d '{"restaurant_id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurant`

- GetMetricsByRestaurantAndDate: `grpcurl -d '{"restaurant_id": "example_restaurant_id", "date": "example_date"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurantAndDate`

- GetMetricsByRestaurantGroup: `grpcurl -d '{"restaurant_group_id": 1}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurantGroup`

- PushMetric: `grpcurl -d '{"restaurant_id": "example_restaurant_id", "code": "example_code", "value": "example_value"}' localhost:50020 com.goodfood.reporting.ReportingService.PushMetric`

- GetRestaurant: `grpcurl -d '{"id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.GetRestaurant`

- CreateRestaurant: `grpcurl -d '{"name": "example_name", "key": "example_key", "address": "example_address", "group_id": 1}' localhost:50020 com.goodfood.reporting.ReportingService.CreateRestaurant`

- UpdateRestaurant: `grpcurl -d '{"id": "example_restaurant_id", "name": "example_name", "key": "example_key", "address": "example_address", "group_id": 1}' localhost:50020 com.goodfood.reporting.ReportingService.UpdateRestaurant`

- DeleteRestaurant: `grpcurl -d '{"id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.DeleteRestaurant`

- GetRestaurantGroup: `grpcurl -d '{"id": 1}' localhost:50020 com.goodfood.reporting.ReportingService.GetRestaurantGroup`

- CreateRestaurantGroup: `grpcurl -d '{"name": "example_group_name"}' localhost:50020 com.goodfood.reporting.ReportingService.CreateRestaurantGroup`

- UpdateRestaurantGroup: `grpcurl -d '{"id": 1, "name": "example_group_name"}' localhost:50020 com.goodfood.reporting.ReportingService.UpdateRestaurantGroup`

- DeleteRestaurantGroup: `grpcurl -d '{"id": 1}' localhost:50020 com.goodfood.reporting.ReportingService.DeleteRestaurantGroup`

I've included placeholder values like "example_key" and "example_restaurant_id" in the commands. Replace them with the actual values you want to use when making the requests
