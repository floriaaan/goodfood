# Delivery Microservice

| Informations                                   |
|------------------------------------------------|
| **Port:** 50001                                |
| **Developer:** @Anatole-Godard                 |
| **Status:** In progress                        |
| **Last update:** 2023-05-09                    |
| **Language:** GoLand                           |
| **Dependencies:**                              |
| **Models:** (see [`pkg/models`](./pkg/models)) |

## gRPC Methods

- User model:

    - `Register`: Creates a new user in the system.
    - `GetUser`: Retrieves a user by its ID.
    - `UpdateUser`: Updates the status of an existing user.
    - `DeleteUser`: Deletes a user by its ID.
    - `ListUser`: Retrieves all users.
    - `LogIn`: Retrieves a new token for the given user ID.
    - `LogOut`: Retrieves a boolean and delete the user token.
    - `ChangePassword`: Changes the password of the given user ID.
    - `ChangeRole`: Changes the role of the given user ID.

- MainAddress person model:
    - `GetMainAddress`: Retrieves a MainAddress by its ID.
    - `DeleteMainAddress`: Deletes a main address by its ID.

## Requirements

To run this microservice, you will need to have the following installed on your system:

- GoLand (v1.19.4 or higher) (dev. with v1.19.4)
- Postgres (v15.2 or higher) (dev. with docker image `postgres:15.2`)

You can use the following tools to help you with the setup:

- You can use docker to run your Postgres database using:
    - `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`

## Getting started

### 1. Clone the repository and install dependencies

1. Clone the `goodfood` repository to your local machine.
2. Navigate to the service directory (`services/user`) in your terminal.
3. Run `go mod download` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (
   see `.env.example`).
5. Run `go run main.go` to start the microservice.

If protos are updated, you will need to regenerate the gRPC code using the following command:
`protoc -I . user.proto --go-grpc_out=. --go_out=.` in the proto directory.

You can now access the microservice at `http://localhost:50001`.

### 2. Create and seed the database

Run the following command to create your Postgres database structure. This also creates the models tables that are
defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file
in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

## Build and Run with Docker

### Build

To build the image you need to be in the **parent folder** of the service you want to build. Then run the following
command:

```
docker build -t goodfood-user:1.0.0 -f ./user/Dockerfile .
```

### Run

Create the .env base on the .env.example. Then run the following command:

```
docker run --env-file=.env goodfood-user:1.0.0 
```
