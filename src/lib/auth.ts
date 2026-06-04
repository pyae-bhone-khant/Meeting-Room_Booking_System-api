import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

console.log("AUTH LOADED");

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:8080";
const parsedBaseURL = (() => {
  try {
    return new URL(baseURL);
  } catch {
    return null;
  }
})();
const cookieDomain = parsedBaseURL && !["localhost", "127.0.0.1"].includes(parsedBaseURL.hostname)
  ? parsedBaseURL.hostname
  : undefined;
const cookieSecure = parsedBaseURL?.protocol === "https:";
const cookieSameSite = parsedBaseURL?.protocol === "https:" ? "none" : "lax";

export const auth = betterAuth({
    baseURL,

    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: false,
    },
    
    // ✅ Use the correct Better-Auth cookie config path and avoid invalid domain on localhost.
    advanced: {
      useSecureCookies: cookieSecure,
      crossSubDomainCookies: cookieDomain
        ? {
            enabled: true,
            domain: cookieDomain,
          }
        : {
            enabled: false,
          },
      defaultCookieAttributes: {
        secure: cookieSecure,
        sameSite: cookieSameSite,
      },
      cookies: {
        session_token: {
           name: "__Secure-better-auth.session_token",
          attributes: {
            secure: cookieSecure,
            sameSite: cookieSameSite,
            partitioned: true,
          },
        },
        dont_remember: {
          attributes: {
            secure: cookieSecure,
            sameSite: cookieSameSite,
            partitioned: true,
          },
        },
      },
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
      "https://meeting-room-booking-system-iota.vercel.app"
    ],
});