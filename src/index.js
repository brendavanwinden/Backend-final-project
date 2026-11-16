import "dotenv/config";
import express from "express";
import * as Sentry from "@sentry/node";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import loginRouter from "./routes/login.js";
import usersRouter from "./routes/users.js";
import hostsRouter from "./routes/hosts.js";
import propertiesRouter from "./routes/properties.js";


const app = express();

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => res.send("Hello world!"));

// TEMPORARY: to test Sentry, remove later
app.get("/debug-error", () => {
  throw new Error("Sentry test error");
});

// routes will go here
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/hosts", hostsRouter);
app.use("/properties", propertiesRouter);
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

app.listen(3000, () => console.log("Server is listening on port 3000"));
