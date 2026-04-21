import Redis from 'ioredis';
import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from './serverConfig';

const redisConfig = {
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD || undefined,
    tls: REDIS_PASSWORD ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    keepAlive: 10000,
    retryStrategy(times: number) {
        const delay = Math.min(times * 1000, 30000);
        return delay;
    }
}

const redisConnection = new Redis(redisConfig);
redisConnection.on("error", (err: Error) => {
    console.error("[Redis] Connection error:", err.message);
});
export default redisConnection;