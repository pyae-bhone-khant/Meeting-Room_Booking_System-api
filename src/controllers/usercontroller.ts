import type { Request, Response , NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { success } from "better-auth";
import { createUserBooking, DeleteBookingService, getBookingByDate } from "../services/user.js";

export const getAllBooking = async (req: Request, res: Response, next: NextFunction) => {
    
   const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });


    res.json({ message: "Get all booking" , Allbooking : bookings });
};

export const getOwnBookings = async (req: Request, res: Response, next: NextFunction) => {
  // authMiddleware ကနေ ပါလာတဲ့ လက်ရှိ login ဝင်ထားသူရဲ့ ID ကို ယူမယ်
  const userId = req.user?.id; 

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Please login again '
    });
  }

  // Database ထဲမှာ လက်ရှိ user ဆောက်ထားတဲ့ booking တွေကိုပဲ ရှာမယ်
  const myBookings = await prisma.booking.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // အောင်မြင်စွာ ဒေတာပြန်ပို့ပေးမယ်
  res.status(200).json({
    success: true,
    data: myBookings
  });
};

export const createBooking= [
    body('startTime').trim().notEmpty().withMessage('Start time is required'),
    body('endTime').trim().notEmpty().withMessage('End time is required'),
    body('startDate').trim().notEmpty().withMessage('Start date is required'),
    body('endDate').trim().notEmpty().withMessage('End date is required'),
    body('roomNo').trim().notEmpty().withMessage('Room number is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('roomType').trim().notEmpty().withMessage('Room type is required'),
    async (req: Request, res: Response, next: NextFunction) => {
       
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || 'Validation failed',
      errors: errors.array()
    });
  } 

  const { startTime, endTime, startDate, endDate , roomNo, location, roomType } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'အသုံးပြုသူကို ခွဲခြား၍မရပါသဖြင့် ပြန်လည် Login ဝင်ပေးပါ။'
    });
  }  

  const startNew = new Date(startTime);
  const endNew = new Date(endTime);

  if ( startNew >= endNew) {
     return res.status(400).json({
      success : false ,
       message : 'Start time must be before end time'
     })
  }

  const  DateData = {
     startTime : {lt : endNew},
     endTime : {gt : startNew}
  }
  const overlappingBooking = await getBookingByDate(DateData)
  if (overlappingBooking) {
     return res.status(400).json({
      success : false ,
       message : 'Booking time is already taken'
     })
  }

  const data = {
      startTime: startNew,
      endTime: endNew,
      startDate: new Date(startDate), 
      endDate: new Date(endDate),     
      roomNo,
      location,
      roomType,
      userId: userId
  } 

  const newBooking = await createUserBooking(data) 

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  })
 
    }
] 

export const deleteBooking = [
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

    if(role === "USER"  && booking.userId !== userId) {
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