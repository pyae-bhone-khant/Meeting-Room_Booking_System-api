import { prisma } from "../lib/prisma.js"

 
   export const getBookingByDate = (DateData :any) => {
     return prisma.booking.findFirst({
        where: {
           startTime : DateData.startTime,
           endTime : DateData.endTime
        }
     })
} 

export const createUserBooking = (data :any) => {
    return prisma.booking.create({
        data: data
    })
} 

export const getBookingById = (id : any) => {
    return prisma.booking.findUnique({
        where : {
            id 
        }
    })
}

export const DeleteBookingService = (id : any) => {
    return prisma.booking.delete({
        where : {
            id
        }
    })
}