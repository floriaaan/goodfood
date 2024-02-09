import { Redis } from "ioredis"

export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
})