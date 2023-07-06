# Order Microservice

| Informations                                       |
| -------------------------------------------------- |
| **Port:** 50007                                    |
| **Developer:** @floriaaan                          |
| **Status:** In progress                            |
| **Last update:** 2023-05-10                        |
| **Language:** NodeJS                               |
| **Dependencies:** TypeScript, gRPC, Postgres, AMQP |
| **Models:**                                        |

## gRPC Methods

The service provides the following gRPC methods:

- `GetOrder`: Retrieves an order by its ID.
- `GetOrdersByUser`: Retrieves a list of orders for a given user.
- `GetOrderByDelivery`: Retrieves an order by its delivery ID.
- `GetOrderByPayment`: Retrieves an order by its payment ID.
- `GetOrdersByStatus`: Retrieves a list of orders by status.
- `CreateOrder`: Creates a new order.
- `UpdateOrder`: Updates an existing order.
- `DeleteOrder`: Deletes an order by its ID.

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
2. Navigate to the service directory (`services/order`) in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (see `.env.example`).
5. Run `npm run start` to start the microservice.

You can now access the microservice at `http://localhost:50007`.

NB: If you want to run the microservice in development mode, you can run `npm run dev` instead.

## Testing

### Requests examples

**Install `grpcurl` on your machine.**

- GetOrder: `grpcurl -d '{"id": "example_order_id"}' localhost:50007 com.goodfood.order.OrderService.GetOrder`
- GetOrdersByUser: `grpcurl -d '{"id": "example_user_id"}' localhost:50007 com.goodfood.order.OrderService.GetOrdersByUser`
- GetOrderByDelivery: `grpcurl -d '{"id": "example_delivery_id"}' localhost:50007 com.goodfood.order.OrderService.GetOrderByDelivery`
- GetOrderByPayment: `grpcurl -d '{"id": "example_payment_id"}' localhost:50007 com.goodfood.order.OrderService.GetOrderByPayment`
- GetOrdersByStatus: `grpcurl -d '{"status": "PENDING"}' localhost:50007 com.goodfood.order.OrderService.GetOrdersByStatus`
- CreateOrder: `grpcurl -d '{"payment_id": "example_payment_id", "delivery_id": "example_delivery_id", "user": {"id": "example_user_id", "first_name": "example_first_name", "last_name": "example_last_name", "email": "example_email", "phone": "example_phone"}, "basket_snapshot": {"string": "example_string"}, "restaurant_id": "example_restaurant_id"}' localhost:50007 com.goodfood.order.OrderService.CreateOrder`
- UpdateOrder: `grpcurl -d '{"id": "example_order_id", "payment_id": "example_payment_id", "delivery_id": "example_delivery_id", "status": "IN_PROGRESS", "restaurant_id": "example_restaurant_id"}' localhost:50007 com.goodfood.order.OrderService.UpdateOrder`
- DeleteOrder: `grpcurl -d '{"id": "example_order_id"}' localhost:50007 com.goodfood.order.OrderService.DeleteOrder`
- GetOrdersAffluence: `grpcurl -d '{"date": "example_date", "restaurant_id": "example_restaurant_id"}' localhost:50007 com.goodfood.order.OrderService.GetOrdersAffluence`
