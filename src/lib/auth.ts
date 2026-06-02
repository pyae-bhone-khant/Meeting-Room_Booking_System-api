import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
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

  baseURL: "https://meeting-room-booking-system-api.onrender.com",
 advanced: {
    cookies: {
      sessionToken: {
        // options အစား attributes ဟု သုံးရပါမည်
        attributes: {
          sameSite: "none", // 👈 Cross-site Context အတွက်
          secure: true,     // HTTPS ပေါ်တွင်သာ အလုပ်လုပ်ရန်
        }
      }
    },
    crossSubdomainCookies: {
      enabled: true,
    }
  },

  trustedOrigins: [
   "http://localhost:5173",
    "http://localhost:3000",
    "https://meeting-room-booking-system-neon.vercel.app"
  ],
});