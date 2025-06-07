import { prisma } from "../lib/prisma";
import { User } from "../types/user";
import { CreateUserInput, UpdateUserInput } from "../validators/user";

export const findAllUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany();
}

export const findUserById = async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}

export const createUser = async (userData: CreateUserInput): Promise<User> => {
    return await prisma.user.create({
        data: userData,
    });
}

export const deleteUser = async (id: number): Promise<User | null> => {
    return await prisma.user.delete({
        where: {
            id: id,
        },
    });
}

export const upsertUser = async (id: number, userData: UpdateUserInput): Promise<User> => {
    return await prisma.user.upsert({
            where: { id: id },
            update: { name: userData.name, email: userData.email },
            create: { name: userData.name ?? "", email: userData.email ?? "" },
        });
    }