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

export const checkUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    });
};

export const createNewUser = async (userData: any) => {
    return prisma.user.create({
        data: userData ,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
    });
};