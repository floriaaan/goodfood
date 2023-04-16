# Log Microservice

| Informations                                                       |
| ------------------------------------------------------------------ |
| **Port:** 50021                                                    |
| **Developer:** @floriaaan                                          |
| **Status:** In progress                                            |
| **Last update:** 2023-04-16                                        |
| **Language:** Go                                               |
| **Dependencies:** ?               |

## gRPC Methods

TBW

## Requirements

To run this microservice, you will need to have the following installed on your system:

- Go (dev. with go version go1.20.2 darwin/arm64)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)

You can use the following tools to help you with the setup:


- You can use docker to run your Postgres database using:
  - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/log`) in your terminal.
