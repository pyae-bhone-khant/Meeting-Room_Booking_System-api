
import { count } from "node:console";
import { prisma } from "../lib/prisma";

export const getAllUsersService = () => {
    return prisma.user.findMany({
       select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { bookings: true } 
        },
        bookings: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            roomNo: true,
            createdAt: true
          }
        }
      }
    })
}