import { prisma } from "./prisma.js";
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


  advanced: {
    useSecureCookies: true, 
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none",
          secure: true,     
          partitioned: true,
        },
      },
    },
  },
});