import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { prisma } from "./prisma.js";

// 🌟 👑 အဓိက ပြင်ဆင်လိုက်သည့်နေရာ: 
// Custom Prisma Client အတွက် အနည်းဆုံး လိုအပ်သော configuration options များကို argument အဖြစ် ထည့်ပေးလိုက်ခြင်း


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",

    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
            },
        },
    },
    // auth.ts ထဲတွင်
advanced: {
  cookies: {
    sessionToken: {
      attributes: {
        // Local မှာဆိုရင် HTTP ကို ခွင့်ပြုဖို့အတွက် secure ကို false ထားပါ
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        partitioned: true,
      }
    }
  }
},
  trustedOrigins: [
    "https://meeting-room-booking-system-neon.vercel.app",
    "https://meeting-room-booking-system-neon.vercel.app/",
    "https://meeting-room-booking-system-neon.vercel.app/login",
    "https://meeting-room-booking-system-bfoy.onrender.com",
    "http://localhost:3000",
  ],
});
