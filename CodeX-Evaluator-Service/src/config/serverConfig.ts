try {
    process.loadEnvFile();
} catch (e) {
    // Environment variables provided by container
}

export const PORT = process.env.PORT || 4001;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
export const REDIS_HOST = process.env.REDIS_HOST || "[IP_ADDRESS]";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
export const LOG_DB_URI = process.env.LOG_DB_URI || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
