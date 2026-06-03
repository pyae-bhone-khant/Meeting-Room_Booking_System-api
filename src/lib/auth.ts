import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

console.log("AUTH LOADED");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",

    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: false,
    },
    
    // ✅ ၁။ စာလုံးပေါင်းကို သင့်နဂိုမူလအတိုင်း 'crossSubDomainCookies' ပြန်ပြောင်းထားပါတယ်
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
    },

    // ✅ ၂။ cookies config ကို advanced အပြင်ဘက် (core options) ထဲမှာပဲ သီးသန့်ထားရပါမယ်
    // ဒါဆိုရင် TypeScript Error လည်း ပျောက်သွားပြီး sign-out cookie လည်း အလုပ်လုပ်ပါလိမ့်မယ်
    cookies: {
      sessionToken: {
        attributes: {
          secure: true,
          sameSite: "none",
        }
      },
      dontRemember: {
        attributes: {
          secure: true,
          sameSite: "none",
        }
      }
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
    
    trustedOrigins: [
      "https://meeting-room-booking-system-neon.vercel.app",
      "https://meeting-room-booking-system-bfoy.onrender.com",
      "http://localhost:3000",
    ],
});