# Gateway Microservice

| Informations                       |
| ---------------------------------- |
| **Port:** 50000                    |
| **Developer:** @Anatole-Godard     |
| **Status:** In progress            |
| **Last update:** 2023-07-15        |
| **Language:** NodeJS               |
| **Dependencies:** TypeScript, gRPC |
| **Models:**                        |

## Http Routes

The gateway provides the following routes:

[//]: # "TODO: Add routes"

## Requirements

To run this microservice, you will need to have the following installed on your system:

- NodeJS (v18.12.0 or higher) (dev. with v18.12.0)

You can use the following tools to help you with the setup:

- You can use nvm to set your Node version using:
  - `nvm use`.

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/gateway`) in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (
   see `.env.example`).
5. Run `sh proto/build-protos.sh` to generate js file to create the clients.
<!--
    NOT NECESSARY IF YOU USE THE LAST VERSION OF THE SCRIPT
    5.1. Then replace all "import * as grpc from "grpc";" package iteration by "import * as grpc from "@grpc/grpc-js";"
    All the occurence of the package "grpc" must be replaced by "@grpc/grpc-js" in the folder "services/gateway/src/proto"
-->
6. Run `npm run start` to start the microservice.

You can now access the microservice at `http://localhost:50000`.

NB: If you want to run the microservice in development mode, you can run `npm run dev` instead.

## To set up stripe webhook
Use this command once the gateway is running:  
`stripe listen --forward-to localhost:4242/webhook `

## Testing

### Requests examples

[//]: # "TODO: Add requests examples"
