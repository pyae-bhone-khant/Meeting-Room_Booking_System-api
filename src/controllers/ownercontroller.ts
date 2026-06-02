import type { Request, Response , NextFunction } from "express";
import { param, validationResult } from "express-validator";
import { DeleteBookingService, getBookingByDate } from "../services/user.js";
import { getAllUsersService } from "../services/owner.js";

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

    if(role !== "OWNER" && role !== "ADMIN") {
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

export const getUserSummary = async (req : Request , res : Response , next : NextFunction) => {
  try {
      const userId = req.user.id;
      const role = req.user.role;

      if (!userId || !role) {
        return res.status(401).json({
          success : false , 
          message : "Unauthorized"
        })
      } 
      if (role !== "OWNER" && role !== "ADMIN") {
        return res.status(403).json({
          success : false , 
          message : "You don't have permission to access this resource"
        })
      } 

      const userData = await getAllUsersService(); 
      const formattedSummary = userData.map(user => ({
       userId: user.id,
      userName: user.name,
      userEmail: user.email,
      totalBookings: user._count.bookings,
      bookings: user.bookings
      }));

      return res.status(200).json({
        success: true,
        data: formattedSummary
      });
      
  } catch (error) {
   next(error)
  }
}