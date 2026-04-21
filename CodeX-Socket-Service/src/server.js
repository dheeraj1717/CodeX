const express = require("express");
const { createServer } = require("http");
const { default: Redis } = require("ioredis");
const { Server } = require("socket.io");

try { process.loadEnvFile(); } catch (e) {}

const app = express();
const httpServer = createServer(app);
app.use(express.json());

const redisCache = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_PASSWORD ? {} : undefined,
    maxRetriesPerRequest: 20, // Not a BullMQ worker, so we can set a limit
    enableReadyCheck: false,
    keepAlive: 10000,
    retryStrategy(times) {
        const delay = Math.min(times * 1000, 30000);
        return delay;
    }
});

redisCache.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
});

const io = new Server(httpServer, {
    cors: {
        origin: "https://code-x-hazel.vercel.app",
        methods: ["GET", "POST"]
    },
    allowEIO3: true
});

io.on("connection", (socket) => {
    console.log("a user connected " + socket.id);
    socket.on("setUserId", (userId) => {
        redisCache.set(userId, socket.id);
    });
    socket.on("getConnectionId", (userId) => {
        redisCache.get(userId).then((connectionId) => {
            socket.emit("connectionId", connectionId);
        });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected " + socket.id);
    });
});

app.post('/sendPayload', async (req, res)=>{
    console.log("Payload received", req.body);
    const {userId, payload} = req.body;
    if(!userId || !payload){
        return res.status(400).send("Invalid request");
    }
    const connectionId = await redisCache.get(userId);
    if(!connectionId){
        return res.status(404).send("User not found");
    }
    io.to(connectionId).emit("submissionPayloadResponse", payload);
    res.send("Payload sent successfully");
})

httpServer.listen(4005, '0.0.0.0', () => {
    console.log("listening on :4005");
});