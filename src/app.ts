import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { auth } from "./lib/auth.js";
import { error } from "node:console";
import { errorHandler } from "./middleware/error-handler.js";
import userRouter from "./routes/userroute/user.js";
import ownerRouter from "./routes/ownerRoute/owner.js";
import adminRouter from "./routes/adminRoute/admin.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",                     // Local Vite Frontend
  "http://localhost:3000",                     // Local Next.js / React Frontend
  "https://meeting-room-booking-system-neon.vercel.app"   // 👈 မင်းရဲ့ Frontend Public Live URL (အသစ်ထည့်ရန်)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 👈 Better-Auth ရဲ့ Session Cookies တွေအတွက် ဒါက မဖြစ်မနေ True ထားရပါမယ်
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

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.static("uploads"));
 
app.use("/api", userRouter);
app.use("/api", ownerRouter);
app.use("/api", adminRouter);

app.get("/error", async (req, res) => {
  throw new Error("Test Error");
});


app.use(errorHandler);

export default app;
