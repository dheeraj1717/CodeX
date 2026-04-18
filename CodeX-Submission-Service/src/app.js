const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const repositoryPlugin = require("./repository/repositoryPlugin");
async function app(fastify, options) {
    fastify.register(require("@fastify/cors"), {
        origin: "*",
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "set-cookie"],
        credentials: true
    });

    // register test route
    fastify.register(require("./routes/api/apiRoutes"), { prefix: "/api" });
    fastify.register(repositoryPlugin);
    fastify.register(servicePlugin);
}

module.exports = fastifyPlugin(app);