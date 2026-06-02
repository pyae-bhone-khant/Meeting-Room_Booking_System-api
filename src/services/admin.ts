import { prisma } from "../lib/prisma";

export const getAllUsersService = () => {
    return prisma.user.findMany({
        select : {
            id : true,
            name : true,
            email : true,
            role : true, 
            createdAt : true , 
            _count : {
                select : {
                    bookings : true
                } 
            } 
        },
        orderBy : {
             createdAt : "desc"
         }
    });
};