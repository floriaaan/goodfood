# Delivery Microservice

| Informations                                                       |
|--------------------------------------------------------------------|
| **Port:** 50004                                                    |
| **Developer:** @PierreLbg                                          |
| **Status:** In progress                                            |
| **Last update:** 2023-05-09                                        |
| **Language:** NodeJS                                               |
| **Dependencies:** TypeScript, Prisma, gRPC, Postgres               |
| **Models:** (see [`prisma/schema.prisma`](./prisma/schema.prisma)) |

## gRPC Methods

- Category model:

    - `CreateCategory`: Creates a new category in the system.
    - `ReadCategory`: Retrieves a category by its ID.
    - `UpdateCategory`: Updates the value of an existing category.
    - `DeleteCategory`: Deletes a category by its ID.
    - `GetCategoryList`: Retrieves all category in the system.

- Allergen model:
    - `CreateAllergen`: Creates a new allergen in the system.
    - `ReadAllergen`: Retrieves a allergen by its ID.
    - `UpdateAllergen`: Updates an existing allergen.
    - `DeleteAllergen`: Deletes a allergen by its ID.
    - `GetAllergenList`: Retrieves all allergen persons.

- Product model:
    - `CreateProduct`: Creates a new product in the system.
    - `ReadProduct`: Retrieves a product by its ID.
    - `UpdateProduct`: Updates an existing product.
    - `DeleteProduct`: Deletes a product by its ID.
    - `GetProductList`: Retrieves all product.
    - `GetProductTypeList`: Retrieves all product type.
    - `UploadImage` : Return url for an image in base64 format.

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
2. Navigate to the service directory (`services/product`) in your terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a `.env` file at the root of the project directory and add the environment variables values (
   see `.env.example`).
5. Run `npm run start` to start the microservice.

You can now access the microservice at `http://localhost:50004`.

NB: If you want to run the microservice in development mode, you can run `npm run dev` instead.

### 2. Create and seed the database

Run the following command to create your Postgres database structure. This also creates the models tables that are
defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```shell
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file
in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

## Build and Run on azure

### Build

Connect to your azure acount.
```shell
az login
```

Open a terminal at the root folder (/service) and execute those command to export the docker
```shell
docker build -t goodfood-product:1.0.x -f ./product/Dockerfile .
docker tag goodfood-product:1.0.x pierrelbg/goodfood-product:1.0.x
docker push pierrelbg/goodfood-product:1.0.x
```

To deploy the service goes his folder (/service/product) and run
```shell
sh deploy.sh
```