# gateway-mock

REST mock of `services/gateway`, so the frontend (`apps/web`) can run without any real
microservice. It exposes the same paths as the real gateway on port `50000`, backed by an
in-memory, deterministically-seeded (faker seed `4242`) fixture store — no gRPC, no databases.

Auth is fully mocked: `/api/user/login` issues a real JWT (`jsonwebtoken`, `HS256`) so
`withCheck({ role, id })` still enforces role/ownership like the real gateway, it just decodes
the token itself instead of calling the user microservice.

## Test users

All passwords are `password`.

| Email                  | Role            |
| ----------------------- | --------------- |
| admin@goodfood.com     | ADMIN           |
| manager@goodfood.com    | MANAGER         |
| user@goodfood.com       | USER            |
| delivery@goodfood.com   | DELIVERY_PERSON |

10 additional random `USER` accounts are seeded (`password` too) for admin-list testing.

## Usage

### Standalone (no Docker)

```shell
cd services/gateway-mock
npm install
npm run dev   # http://localhost:50000
```

### Docker (recommended: front only, zero microservices)

```shell
docker compose -f services/docker-compose.mock.yml up --build
```

Then run the frontend as usual — its default `NEXT_PUBLIC_API_URL=http://localhost:50000`
(see `apps/web/.env.example`) already points at this port, so no frontend config changes are
needed.

## Coverage

Every route defined by the real gateway's controllers is implemented (user, restaurant,
product/category/allergen, basket, order, payment/stripe, delivery/delivery-person, promotion,
stock/supplier/ingredient/supply-order, notification, metric, log, health-check). Business rules
are simplified — no Stripe, no gRPC, no cross-service side effects — but response shapes match
the `apps/web/types/*` contracts the frontend actually consumes.

Data mutates in memory per process; restart the container to reset to the seeded state.
