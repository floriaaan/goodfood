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

- `GetPayment(GetPaymentRequest) returns (Payment) {}`
  This RPC function is part of the PaymentService service. It is used to retrieve information about a single payment. The client sends a request GetPaymentRequest containing the necessary information (e.g., payment ID), and the server responds with a Payment message containing the details of the requested payment.
- `GetPaymentsByUser(GetPaymentsByUserRequest) returns (GetPaymentsByUserResponse) {}`
  Also part of the PaymentService service, this RPC function allows the client to get a list of payments associated with a specific user. The client sends a GetPaymentsByUserRequest, typically containing the user's ID, and the server responds with a GetPaymentsByUserResponse message containing a list of payments relevant to that user.
- `CreateCheckoutSession(CreateCheckoutSessionRequest) returns (CreateCheckoutSessionResponse) {}`
  This RPC function belongs to the StripeService service. It is utilized to create a checkout session for Stripe, which typically involves setting up a payment gateway or initiating a payment process for a user. The client sends a CreateCheckoutSessionRequest with relevant information required for the session, and the server responds with a CreateCheckoutSessionResponse, which may contain details or identifiers related to the created session.

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

How to test the microservice:

Pre-requisites:

- You need to have a Postgres database running on your machine, the migrations need to be applied.
- You need to have an internet connection.

1. Run the microservice (see [Getting started](#getting-started)).
2. Use a gRPC client (e.g. [Postman](https://www.postman.com/)) to send requests to the microservice (see [gRPC Methods](#grpc-methods)).
   - Send a request to the `CreateCheckoutSession` method to create a payment.
     It should return a `CreateCheckoutSessionResponse` with the created payment, and an URL by Stripe to pay the order.
     The payment should be created in the database.
     When the payment is paid, the order should be updated in the database using the webhook, it should also be updated in the database when the checkout has expired.
   - Send a request to the `GetPayment` method to get a payment.
     It should return a `GetPaymentResponse` with the payment.
   - Send a request to the `GetPaymentsByUser` method to get all payments.
     It should return a `GetPaymentsByUserResponse` with all payments.
