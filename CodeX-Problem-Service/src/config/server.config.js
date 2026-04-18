process.loadEnvFile();

module.exports = {
    PORT: process.env.PORT || 3000,
    ATLAS_DB_URI: process.env.ATLAS_DB_URI,
    LOG_DB_URI: process.env.LOG_DB_URI,
    NODE_ENV: process.env.NODE_ENV || "development",
}