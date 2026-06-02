import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { checkUserByEmail, createNewUser, getAllUsersService } from "../services/admin";
import { body, validationResult } from "express-validator";
import { checkUserExists } from "../utils/admin";
import bcrypt from "bcrypt";


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

export const createUser =  [
    body("name").isString().notEmpty(),
    body("email").isEmail().notEmpty(),
    body("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").notEmpty(),
    body("role").isString().notEmpty().custom((value) => {
        if (value !== "USER" && value !== "ADMIN" && value !== "OWNER") {
            throw new Error("Role must be either USER, ADMIN or OWNER");
        }
        return true;
    }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || "Validation failed"
      });
    }
    try {
        const adminRole = req.user?.role;
        if (adminRole !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied , Only admin can create user"
            });
        } 

        const {name , email , password , role} = req.body; 

        const user = await checkUserByEmail(email); 
        await checkUserExists(user); 

        const salt  = 10 ; 
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = `user_${Date.now()}`; 
       
        const userData = {
           id: userId,
          name,
          email,
          role: role || "USER",
          accounts: {
            create: {
              id: `acc_${Date.now()}`,
              providerId: "credentials", // Manual login ဖြစ်လို့ credentials လို့ ပေးထားပါမယ်
              accountId: userId,
              password: hashedPassword 
            }
          }
        }; 

        const newuser = await createNewUser(userData);
        return res.status(201).json({
        success: true,
        message: "User created successfully with secure password",
        data: newuser
      });
        
    } catch (error) {
      next(error);
    }
  }
]
