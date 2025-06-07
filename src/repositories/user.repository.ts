import { Prisma } from "../generated/prisma";
import { prisma } from "../lib/prisma";
import { User } from "../types/user";
import { CreateUserInput, GetUsersQueryInput, UpdateUserInput } from "../validators/user";

export const findAllUsers = async ({
    page = 1,
    limit = 10,
    sort = "id",
    order = "asc",
    search = "",
}: GetUsersQueryInput): Promise<User[]> => {
    const skip = (page - 1) * limit;
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { email: { contains: search, mode: Prisma.QueryMode.insensitive } }
            ]
        }
        : {};

    return prisma.user.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
    });
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