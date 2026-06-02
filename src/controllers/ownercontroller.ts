import type { Request, Response , NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { param, validationResult } from "express-validator";
import { DeleteBookingService, getBookingByDate } from "../services/user";

export const deleteAnyBooking = [
  param('id').trim().notEmpty().withMessage('Booking ID is required'),
  async (req : Request , res : Response , next : NextFunction) => {
    const error  = validationResult(req);
    if(!error.isEmpty()) {
      return res.status(400).json({
        success : false , 
        message : error.array()[0]?.msg || "validation failed "
      })   
    }
    const bookingId  = req.params.id; 
    const userId  = req.user.id;
    const role = req.user.role;

    const booking = await getBookingByDate( bookingId)
     if (!booking) {
      return  res.status(404).json({
        success : false , 
        massage : "Booking not found!"
      })
     }

    if(role !== "OWNER") {
       return res.status(403).json({
        success : false , 
        message : "That booking to delete you don't have permission"
       }) 
    } 

     await DeleteBookingService(bookingId)

     res.status(200).json({
      success : true , 
      message : "Booking delete successfully"
     })
  }
]