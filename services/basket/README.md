# Basket Microservice

| Informations                              |
|-------------------------------------------|
| **Port:** 50002                           |
| **Developer:** @Anatole-Godard            |
| **Status:** In progress                   |
| **Last update:** 2023-08-14               |
| **Language:** NodeJS                      |
| **Dependencies:** TypeScript, gRPC, Redis |

## gRPC Methods

- Basket model:

    - `GetBasket`: Retrieves a basket by its user ID.
    - `AddProduct`: Adds a product to a basket.
    - `DeleteProduct`: Deletes a product from a basket.
    - `Reset`: Resets a basket.
    - `UpdateRestaurant`: Sets a restaurant to a basket.

## Requirements

To run this microservice, you will need to have the following installed on your system:

- NodeJS (v18.12.0 or higher) (dev. with v18.12.0)
- Redis (v6.2.6 or higher) (dev. with docker image `redis:6.2.6`)