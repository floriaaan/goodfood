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

<!-- 1. Create a new report

```sh
grpcurl -d '{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }' \
    localhost:50020 com.goodfood.reporting.ReportingService.PushMetric
```

```json
{ "restaurant_id": "restaurant_id:1", "code": "income_1h", "value": "99.99" }
``` -->


1.  GetMetric:

`grpcurl -d '{"key": "example_key"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetric` 

2.  GetMetricsByRestaurant:


`grpcurl -d '{"restaurant_id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurant` 

3.  GetMetricsByRestaurantAndDate:


`grpcurl -d '{"restaurant_id": "example_restaurant_id", "date": "example_date"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurantAndDate` 

4.  GetMetricsByRestaurantGroup:


`grpcurl -d '{"restaurant_group_id": "example_group_id"}' localhost:50020 com.goodfood.reporting.ReportingService.GetMetricsByRestaurantGroup` 

5.  PushMetric:


`grpcurl -d '{"restaurant_id": "example_restaurant_id", "code": "example_code", "value": "example_value"}' localhost:50020 com.goodfood.reporting.ReportingService.PushMetric` 

6.  GetRestaurant:


`grpcurl -d '{"id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.GetRestaurant` 

7.  CreateRestaurant:


`grpcurl -d '{"name": "example_name", "key": "example_key", "address": "example_address", "group_id": "1"}' localhost:50020 com.goodfood.reporting.ReportingService.CreateRestaurant` 

8.  UpdateRestaurant:


`grpcurl -d '{"id": "example_restaurant_id", "name": "example_name", "key": "example_key", "address": "example_address", "group_id": "1"}' localhost:50020 com.goodfood.reporting.ReportingService.UpdateRestaurant` 

9.  DeleteRestaurant:


`grpcurl -d '{"id": "example_restaurant_id"}' localhost:50020 com.goodfood.reporting.ReportingService.DeleteRestaurant` 

10.  GetRestaurantGroup:


`grpcurl -d '{"id": "1"}' localhost:50020 com.goodfood.reporting.ReportingService.GetRestaurantGroup` 

11.  CreateRestaurantGroup:


`grpcurl -d '{"name": "example_group_name"}' localhost:50020 com.goodfood.reporting.ReportingService.CreateRestaurantGroup` 

12.  UpdateRestaurantGroup:


`grpcurl -d '{"id": "1", "name": "example_group_name"}' localhost:50020 com.goodfood.reporting.ReportingService.UpdateRestaurantGroup` 

13.  DeleteRestaurantGroup:


`grpcurl -d '{"id": "1"}' localhost:50020 com.goodfood.reporting.ReportingService.DeleteRestaurantGroup` 

I've included placeholder values like "example_key" and "example_restaurant_id" in the commands. Replace them with the actual values you want to use when making the requests
