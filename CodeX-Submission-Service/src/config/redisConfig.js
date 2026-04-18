const Redis = require('ioredis');
const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = require('./serverConfig');

const redisConfig = {
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
}

const redisConnection = new Redis(redisConfig);
module.exports = redisConnection;