const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const repositoryPlugin = require("./repository/repositoryPlugin");

async function app(fastify, options) {
    fastify.register(require("@fastify/cors"), {
        origin: "https://code-x-hazel.vercel.app",
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    });

    // register routes
    fastify.register(require("./routes/api/apiRoutes"), { prefix: "/api" });
    fastify.register(repositoryPlugin);
    fastify.register(servicePlugin);
}

module.exports = fastifyPlugin(app);