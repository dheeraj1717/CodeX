const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/server.config");
const apiRouter = require("./routes");
const BaseError = require("./errors/BaseError");
const errorHandler = require("./utils/errorHandler");
const connectDB = require("./config/db.config");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use("/api", apiRouter);

app.get("/ping", (req, res) => {
  res.json({ message: "Problem service is alive" });
});

// last middleware if any error is thrown
app.use(errorHandler);

// first connect to db and then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log("Error connecting to database");
    throw error;
});

