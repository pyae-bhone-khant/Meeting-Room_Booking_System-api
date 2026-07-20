import { prisma } from "./lib/prisma.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

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
      },
    },
  },
  session: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: [
    "https://meeting-room-booking-system-neon.vercel.app", 
    "https://meeting-room-booking-system-q6xr0ifk6.vercel.app", 
    "http://localhost:3000", 
    "https://meeting-room-booking-system-iota.vercel.app"
  ],

  // 👇 အောက်ပါ advanced block ကို အသစ်ထည့်ပေးပါ 👇
  advanced: {
    useSecureCookies: true, // Production (HTTPS) တွင် Secure cookie ဖြစ်စေရန်
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none", // Cross-domain (Frontend <-> Backend) အတွက် "none" ဖြစ်ရပါမည်
          secure: true,     // sameSite: "none" သုံးလျှင် secure: true မဖြစ်မနေ လိုအပ်ပါသည်
        },
      },
    },
  },
});