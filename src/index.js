import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import log from "../src/middleware/logMiddleware.js";
import usersRouter from "../routes/users.js";
import bookingsRouter from "../routes/bookings.js";
import propertiesRouter from "../routes/properties.js";
import hostsRouter from "../routes/hosts.js";
import amenitiesRouter from "../routes/amenities.js";
import reviewsRouter from "../routes/reviews.js";
import loginRouter from "../routes/login.js";
import * as Sentry from "@sentry/node";
import "dotenv/config";

const app = express();

//Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

//Global middleware goes here
app.use(express.json());
app.use(log);

//Routes go here
app.use("/users", usersRouter);
app.use("/bookings", bookingsRouter);
app.use("/properties", propertiesRouter);
app.use("/hosts", hostsRouter);
app.use("/amenities", amenitiesRouter);
app.use("/reviews", reviewsRouter);
// login Route
app.use("/login", loginRouter);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

//erroHandler goes here
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
