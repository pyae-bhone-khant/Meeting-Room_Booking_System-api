import { emitKeypressEvents } from "readline";
import { prisma } from "../lib/prisma.js";

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

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });
}; 

export const updateUserRole = async (id: string, role: string) => {
    return prisma.user.update({
        where: {
            id: id
        },
        data: {
            role: role as any
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
}; 
 
export const deleteUserById = async (id: string) => {
    return prisma.user.delete({
        where: {
            id: id
        }
    });
}; 
 