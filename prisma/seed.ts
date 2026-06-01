import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data");

  // Create users with different roles

  const owner = await prisma.user.create({
    data: {
      id: "user-owner-001",
      name: "Owner User",
      email: "owner@example.com",
      role: "OWNER",
      emailVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: "user-admin-001",
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      id: "user-001",
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user-002",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "USER",
      emailVerified: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user-003",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "USER",
      emailVerified: false,
    },
  });

  console.log("Created 5 users");

  // Create accounts for password authentication
  // Note: better-auth handles password hashing separately
  await prisma.account.create({
    data: {
      id: "account-owner-001",
      accountId: owner.id,
      providerId: "credential",
      userId: owner.id,
    },
  });

  await prisma.account.create({
    data: {
      id: "account-admin-001",
      accountId: admin.id,
      providerId: "credential",
      userId: admin.id,
    },
  });

  await prisma.account.create({
    data: {
      id: "account-001",
      accountId: user1.id,
      providerId: "credential",
      userId: user1.id,
    },
  });

  await prisma.account.create({
    data: {
      id: "account-002",
      accountId: user2.id,
      providerId: "credential",
      userId: user2.id,
    },
  });

  await prisma.account.create({
    data: {
      id: "account-003",
      accountId: user3.id,
      providerId: "credential",
      userId: user3.id,
    },
  });

  console.log("Created 5 accounts");

  // Create bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.booking.create({
    data: {
      id: "booking-001",
      startTime: new Date(today.setHours(9, 0, 0, 0)),
      endTime: new Date(today.setHours(10, 0, 0, 0)),
      startDate: today,
      endDate: today,
      roomNo: "101",
      location: "Main Building",
      roomType: "Conference Room",
      userId: user1.id,
    },
  });

  await prisma.booking.create({
    data: {
      id: "booking-002",
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      startDate: tomorrow,
      endDate: tomorrow,
      roomNo: "202",
      location: "East Wing",
      roomType: "Meeting Room",
      userId: user2.id,
    },
  });

  await prisma.booking.create({
    data: {
      id: "booking-003",
      startTime: new Date(nextWeek.setHours(10, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(12, 0, 0, 0)),
      startDate: nextWeek,
      endDate: nextWeek,
      roomNo: "305",
      location: "West Wing",
      roomType: "Conference Room",
      userId: user1.id,
    },
  });

  await prisma.booking.create({
    data: {
      id: "booking-004",
      startTime: new Date(nextWeek.setHours(15, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(17, 0, 0, 0)),
      startDate: nextWeek,
      endDate: nextWeek,
      roomNo: "101",
      location: "Main Building",
      roomType: "Conference Room",
      userId: user3.id,
    },
  });

  await prisma.booking.create({
    data: {
      id: "booking-005",
      startTime: new Date(today.setHours(11, 0, 0, 0)),
      endTime: new Date(today.setHours(12, 30, 0, 0)),
      startDate: today,
      endDate: today,
      roomNo: "401",
      location: "North Wing",
      roomType: "Board Room",
      userId: admin.id,
    },
  });

  console.log("Created 5 bookings");

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
