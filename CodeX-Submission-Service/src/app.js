const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const repositoryPlugin = require("./repository/repositoryPlugin");

async function app(fastify, options) {
    // Handle CORS via hook — most reliable approach for Fastify
    fastify.addHook("onRequest", async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

        // Short-circuit OPTIONS preflight immediately
        if (request.method === "OPTIONS") {
            reply.code(204).send();
        }
    });

    // register routes
    fastify.register(require("./routes/api/apiRoutes"), { prefix: "/api" });
    fastify.register(repositoryPlugin);
    fastify.register(servicePlugin);
}

module.exports = fastifyPlugin(app);