FROM node:18-alpine as builder

WORKDIR /app

COPY ./gateway-mock/ .

RUN npm install

RUN npm run build

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /app/dist .

EXPOSE 50000

CMD [ "node", "index.js"]
