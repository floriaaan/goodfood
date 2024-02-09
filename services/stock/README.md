# Stock Microservice

| Informations                                                       |
| ------------------------------------------------------------------ |
| **Port:** 50009                                                    |
| **Developer:** @floriaaan                                          |
| **Status:** In progress                                            |
| **Last update:** 2023-07-07                                        |
| **Language:** NodeJS                                               |
| **Dependencies:** TypeScript, Prisma, gRPC, Postgres               |
| **Models:** (see [`prisma/schema.prisma`](./prisma/schema.prisma)) |

## gRPC Methods

TBW

## Requirements

To run this microservice, you will need to have the following installed on your system:

- NodeJS (v18.12.0 or higher) (dev. with v18.12.0)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)

You can use the following tools to help you with the setup:

- You can use nvm to set your Node version using:
  - `nvm use`.
- You can use docker to run your Postgres database using:
  - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/stock`) in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (see `.env.example`).
5. Run `npm run start` to start the microservice.

You can now access the microservice at `http://localhost:50008`.

NB: If you want to run the microservice in development mode, you can run `npm run dev` instead.

### 2. Create and seed the database

Run the following command to create your Postgres database structure. This also creates the models tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.
