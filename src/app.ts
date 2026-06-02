import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { auth } from "./lib/auth";
import { error } from "node:console";
import { errorHandler } from "./middleware/error-handler";
import userRouter from "./routes/userroute/user";
import ownerRouter from "./routes/ownerRoute/owner";
import adminRouter from "./routes/adminRoute/admin";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.static("uploads"));
app.use(express.json());
 
app.use("/api", userRouter);
app.use("/api", ownerRouter);
app.use("/api", adminRouter);

app.get("/error", async (req, res) => {
  throw new Error("Test Error");
});


app.use(errorHandler);

export default app;
