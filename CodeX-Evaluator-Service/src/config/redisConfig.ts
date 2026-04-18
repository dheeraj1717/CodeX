import Redis from 'ioredis';
import { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from './serverConfig';

const redisConfig = {
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
}

const redisConnection = new Redis(redisConfig);
export default redisConnection;