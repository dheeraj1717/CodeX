const Redis = require('ioredis');
const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = require('./serverConfig');

const redisConfig = {
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD || undefined,
    tls: REDIS_PASSWORD ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    keepAlive: 10000, // 10 seconds
    retryStrategy(times) {
        const delay = Math.min(times * 1000, 30000); // Max delay of 30s
        return delay;
    }
}

const redisConnection = new Redis(redisConfig);
redisConnection.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
});
module.exports = redisConnection;