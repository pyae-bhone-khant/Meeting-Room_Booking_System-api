import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../../src/generated/prisma/client.js";

const prisma = new PrismaClient();
export const auth = betterAuth({
    baseURL: process.env.NODE_ENV === "production" ? "https://meeting-room-booking-system-api.onrender.com" : "http://localhost:8000",
    trustedOrigins: ["*"],
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
});