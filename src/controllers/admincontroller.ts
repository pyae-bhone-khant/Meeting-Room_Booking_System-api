import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { getAllUsersService } from "../services/admin";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.user?.role;
    if (role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Access denied , Only admin can see All users" });
    }

    const users = await getAllUsersService();

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ,
      totalBookings: user._count.bookings,
      createdAt: user.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};
